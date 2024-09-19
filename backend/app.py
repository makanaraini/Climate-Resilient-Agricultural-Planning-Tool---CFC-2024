from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random
import csv
from io import StringIO

import logging

app = Flask(__name__)
CORS(app)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "your-secret-key"  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

# This should be replaced with a database in a real application
users = {
    "MAKANA": {
        "password": generate_password_hash("16814KS/makana"),
        "name": "",
        "email": "",
        "location": "",
        "preferred_units": "metric"
    },
    "admin": {
        "password": generate_password_hash("Ask73/RM"),
        "name": "Admin",
        "email": "admin@example.com",
        "location": "",
        "preferred_units": "metric"
    }
}

agricultural_data = [
    {"date": "2023-01-01", "crop": "Wheat", "yield": 5.2, "area": 100},
    {"date": "2023-02-01", "crop": "Corn", "yield": 7.8, "area": 150},
    {"date": "2023-03-01", "crop": "Soybeans", "yield": 3.5, "area": 80},
]

# Mock database of crops and their optimal conditions
crops_db = [
    {"name": "Wheat", "optimal_temp": 21, "optimal_humidity": 50, "optimal_soil_ph": 6.5},
    {"name": "Rice", "optimal_temp": 27, "optimal_humidity": 70, "optimal_soil_ph": 6.0},
    {"name": "Corn", "optimal_temp": 24, "optimal_humidity": 60, "optimal_soil_ph": 6.8},
    {"name": "Soybeans", "optimal_temp": 26, "optimal_humidity": 65, "optimal_soil_ph": 6.3},
    {"name": "Potatoes", "optimal_temp": 18, "optimal_humidity": 55, "optimal_soil_ph": 6.0},
]

# Mock database of crops and their water needs (mm per day)
crops_water_needs = {
    "Wheat": 4,
    "Rice": 8,
    "Corn": 6,
    "Soybeans": 5,
    "Potatoes": 5.5
}

# Mock database of pest/disease risks based on weather conditions
pest_disease_risks = {
    "Wheat": {
        "Rust": {"temp_range": (15, 25), "humidity_range": (60, 80)},
        "Aphids": {"temp_range": (20, 30), "humidity_range": (50, 70)}
    },
    "Rice": {
        "Blast": {"temp_range": (22, 28), "humidity_range": (85, 100)},
        "Brown Planthopper": {"temp_range": (25, 35), "humidity_range": (70, 90)}
    },
    "Corn": {
        "Blight": {"temp_range": (18, 27), "humidity_range": (80, 100)},
        "Armyworm": {"temp_range": (20, 30), "humidity_range": (60, 80)}
    }
}

# Setup logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/api/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400
    
    if username in users:
        return jsonify({"msg": "Username already exists"}), 400
    
    users[username] = {
        "password": generate_password_hash(password),
        "name": "",
        "email": "",
        "location": "",
        "preferred_units": "metric"
    }
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        logging.debug("Request is not JSON")
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    logging.debug(f"Received login attempt: username={username}, password={'*' * len(password)}")

    if not username or not password:
        logging.debug("Missing username or password")
        return jsonify({"msg": "Missing username or password"}), 400

    logging.debug(f"Attempting login for username: {username}")

    if username not in users:
        logging.debug(f"Username {username} not found.")
        return jsonify({"msg": "Bad username or password"}), 401

    stored_password_hash = users[username]["password"]
    logging.debug(f"Stored password hash: {stored_password_hash}")

    if not check_password_hash(stored_password_hash, password):
        logging.debug(f"Password for username {username} is incorrect.")
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    logging.debug(f"User {username} logged in successfully.")
    return jsonify(access_token=access_token), 200

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# Existing routes...

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/weather', methods=['GET'])
@jwt_required()  # This route now requires authentication
def get_weather():
    weather_data = {
        "temperature": 25,
        "humidity": 60,
        "precipitation": 10
    }
    return jsonify(weather_data), 200

@app.route('/api/weather-forecast', methods=['GET'])
@jwt_required()
def get_weather_forecast():
    # Mock data - in a real app, you'd call a weather API here
    forecast = []
    start_date = datetime.now()
    for i in range(7):  # 7-day forecast
        date = start_date + timedelta(days=i)
        forecast.append({
            "date": date.strftime("%Y-%m-%d"),
            "temperature": round(random.uniform(15, 30), 1),
            "humidity": round(random.uniform(30, 80), 1),
            "precipitation": round(random.uniform(0, 20), 1)
        })
    return jsonify(forecast), 200

@app.route('/api/crops', methods=['GET'])
@jwt_required()  # This route now requires authentication
def get_crops():
    crops = [
        {"id": 1, "name": "Wheat", "optimal_temp": 20, "water_needs": "moderate"},
        {"id": 2, "name": "Corn", "optimal_temp": 25, "water_needs": "high"},
        {"id": 3, "name": "Rice", "optimal_temp": 30, "water_needs": "very high"}
    ]
    return jsonify(crops), 200

@app.route('/api/agricultural-data', methods=['GET'])
@jwt_required()
def get_agricultural_data():
    return jsonify(agricultural_data), 200

@app.route('/api/agricultural-data', methods=['POST'])
@jwt_required()
def submit_agricultural_data():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    crop = request.json.get('crop', None)
    yield_amount = request.json.get('yield', None)
    temperature = request.json.get('temperature', None)
    rainfall = request.json.get('rainfall', None)

    if not crop or yield_amount is None or temperature is None or rainfall is None:
        return jsonify({"msg": "Missing data"}), 400

    # This is a placeholder. In a real app, you'd save this to a database.
    new_data = {
        "id": len(agricultural_data) + 1,
        "crop": crop,
        "yield": yield_amount,
        "temperature": temperature,
        "rainfall": rainfall
    }
    agricultural_data.append(new_data)
    return jsonify({"msg": "Data submitted successfully"}), 201

@app.route('/api/clear-users', methods=['POST'])
@jwt_required()
def clear_users():
    current_user = get_jwt_identity()
    if current_user != 'admin':  # Replace 'admin' with your admin username
        return jsonify({"msg": "Unauthorized"}), 403

    users.clear()
    return jsonify({"msg": "All users cleared"}), 200

@app.route('/api/crop-recommendation', methods=['POST'])
@jwt_required()
def get_crop_recommendation():
    data = request.json
    temperature = data.get('temperature')
    humidity = data.get('humidity')
    soil_ph = data.get('soil_ph')

    if not all([temperature, humidity, soil_ph]):
        return jsonify({"error": "Missing required data"}), 400

    recommendations = []
    for crop in crops_db:
        score = (
            (1 - abs(crop['optimal_temp'] - temperature) / 10) * 0.4 +
            (1 - abs(crop['optimal_humidity'] - humidity) / 50) * 0.3 +
            (1 - abs(crop['optimal_soil_ph'] - soil_ph) / 2) * 0.3
        )
        recommendations.append({"crop": crop['name'], "score": round(score * 100, 2)})

    recommendations.sort(key=lambda x: x['score'], reverse=True)
    return jsonify(recommendations[:3]), 200  # Return top 3 recommendations

@app.route('/api/water-management', methods=['POST'])
@jwt_required()
def get_water_management_plan():
    data = request.json
    crop = data.get('crop')
    area = data.get('area')  # in hectares
    days = data.get('days')
    expected_rainfall = data.get('expected_rainfall')  # in mm

    if not all([crop, area, days, expected_rainfall]):
        return jsonify({"error": "Missing required data"}), 400

    if crop not in crops_water_needs:
        return jsonify({"error": "Unknown crop"}), 400

    daily_water_need = crops_water_needs[crop]
    total_water_need = daily_water_need * area * 10000 * days  # Convert to liters
    total_rainfall = expected_rainfall * area * 10000  # Convert to liters
    irrigation_need = max(0, total_water_need - total_rainfall)

    return jsonify({
        "total_water_need": round(total_water_need, 2),
        "expected_rainfall": round(total_rainfall, 2),
        "irrigation_need": round(irrigation_need, 2),
        "daily_irrigation": round(irrigation_need / days, 2) if days > 0 else 0
    }), 200

@app.route('/api/pest-disease-prediction', methods=['POST'])
@jwt_required()
def get_pest_disease_prediction():
    data = request.json
    crop = data.get('crop')
    temperature = data.get('temperature')
    humidity = data.get('humidity')

    if not all([crop, temperature, humidity]):
        return jsonify({"error": "Missing required data"}), 400

    if crop not in pest_disease_risks:
        return jsonify({"error": "Unknown crop"}), 400

    risks = []
    for pest_disease, conditions in pest_disease_risks[crop].items():
        temp_risk = 1 if conditions['temp_range'][0] <= temperature <= conditions['temp_range'][1] else 0
        humidity_risk = 1 if conditions['humidity_range'][0] <= humidity <= conditions['humidity_range'][1] else 0
        risk_level = (temp_risk + humidity_risk) / 2
        if risk_level > 0:
            risks.append({"name": pest_disease, "risk_level": risk_level})

    return jsonify(risks), 200

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user_data = users.get(current_user, {})
    return jsonify({
        "name": user_data.get("name", ""),
        "email": user_data.get("email", ""),
        "location": user_data.get("location", ""),
        "preferred_units": user_data.get("preferred_units", "metric")
    }), 200

@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    user_data = users.get(current_user, {})
    
    data = request.json
    user_data["name"] = data.get("name", user_data.get("name", ""))
    user_data["email"] = data.get("email", user_data.get("email", ""))
    user_data["location"] = data.get("location", user_data.get("location", ""))
    user_data["preferred_units"] = data.get("preferred_units", user_data.get("preferred_units", "metric"))
    
    users[current_user] = user_data
    return jsonify({"msg": "Profile updated successfully"}), 200

@app.route('/api/export-data', methods=['GET'])
@jwt_required()
def export_data():
    # Create a string buffer to hold the CSV data
    si = StringIO()
    cw = csv.writer(si)
    
    # Write the header
    cw.writerow(['Date', 'Crop', 'Yield', 'Area'])
    
    # Write the data
    for row in agricultural_data:
        cw.writerow([row['date'], row['crop'], row['yield'], row['area']])
    
    # Create the HTTP response with CSV mime type
    output = si.getvalue()
    return send_file(StringIO(output),
                     mimetype='text/csv',
                     as_attachment=True,
                     attachment_filename='agricultural_data.csv')

if __name__ == '__main__':
    app.run(debug=True)