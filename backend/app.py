from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random
import csv
from io import StringIO

import logging
import io
import pandas as pd
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

import os
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

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
    {"name": "Wheat", "optimal_temp": 21, "optimal_humidity": 50, "optimal_soil_ph": 6.5, "suitable_soil_types": {"loamy": 1, "sandy": 1}, "optimal_rainfall": 400},
    {"name": "Rice", "optimal_temp": 27, "optimal_humidity": 70, "optimal_soil_ph": 6.0, "suitable_soil_types": {"clay": 1}, "optimal_rainfall": 600},
    {"name": "Corn", "optimal_temp": 24, "optimal_humidity": 60, "optimal_soil_ph": 6.8, "suitable_soil_types": {"loamy": 1}, "optimal_rainfall": 500},
    {"name": "Soybeans", "optimal_temp": 26, "optimal_humidity": 65, "optimal_soil_ph": 6.3, "suitable_soil_types": {"loamy": 1}, "optimal_rainfall": 450},
    {"name": "Potatoes", "optimal_temp": 18, "optimal_humidity": 55, "optimal_soil_ph": 6.0, "suitable_soil_types": {"loamy": 1}, "optimal_rainfall": 300},
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

# Placeholder for Watson credentials
WATSON_API_KEY = os.environ.get('WATSON_API_KEY', 'your-api-key')
WATSON_URL = os.environ.get('WATSON_URL', 'your-url')
WATSON_ASSISTANT_ID = os.environ.get('WATSON_ASSISTANT_ID', 'your-assistant-id')

# Initialize Watson Assistant
authenticator = IAMAuthenticator(WATSON_API_KEY)
assistant = AssistantV2(
    version='2021-06-14',
    authenticator=authenticator
)
assistant.set_service_url(WATSON_URL)

@app.route('/api/register', methods=['POST'])
def register():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400
    
    if username in users:
        return jsonify({"msg": "Username already exists"}), 400
    
    hashed_password = generate_password_hash(password)
    users[username] = {
        "password": hashed_password,
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
    soil_type = data.get('soil_type')
    rainfall = data.get('rainfall')

    if not all([temperature, humidity, soil_ph, soil_type, rainfall]):
        return jsonify({"error": "Missing required data"}), 400

    recommendations = []
    for crop in crops_db:
        score = (
            (1 - abs(crop['optimal_temp'] - temperature) / 10) * 0.3 +
            (1 - abs(crop['optimal_humidity'] - humidity) / 50) * 0.2 +
            (1 - abs(crop['optimal_soil_ph'] - soil_ph) / 2) * 0.2 +
            (1 if crop['suitable_soil_types'].get(soil_type, 0) else 0) * 0.2 +
            (1 - abs(crop['optimal_rainfall'] - rainfall) / 500) * 0.1
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
    soil_type = data.get('soil_type')

    if not all([crop, area, days, expected_rainfall, soil_type]):
        return jsonify({"error": "Missing required data"}), 400

    if crop not in crops_water_needs:
        return jsonify({"error": "Unknown crop"}), 400

    daily_water_need = crops_water_needs[crop]
    total_water_need = daily_water_need * area * 10000 * days  # Convert to liters
    total_rainfall = expected_rainfall * area * 10000  # Convert to liters
    irrigation_need = max(0, total_water_need - total_rainfall)

    # Adjust for soil type
    soil_adjustment = {
        "sandy": 1.2,
        "loamy": 1.0,
        "clay": 0.8
    }
    adjusted_irrigation = irrigation_need * soil_adjustment.get(soil_type, 1.0)

    irrigation_schedule = [
        {"day": i+1, "amount": round(adjusted_irrigation / days, 2)}
        for i in range(days)
    ]

    return jsonify({
        "total_water_need": round(total_water_need, 2),
        "expected_rainfall": round(total_rainfall, 2),
        "irrigation_need": round(adjusted_irrigation, 2),
        "daily_irrigation": round(adjusted_irrigation / days, 2),
        "irrigation_schedule": irrigation_schedule,
        "water_conservation_tips": [
            "Use mulch to reduce evaporation",
            "Water early in the morning or late in the evening",
            "Consider drip irrigation for more efficient water use"
        ]
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

@app.route('/api/generate-report/<format>', methods=['GET'])
@jwt_required()
def generate_report(format):
    # Convert the agricultural_data list to a pandas DataFrame
    df = pd.DataFrame(agricultural_data)

    if format == 'xlsx':
        # Generate Excel file
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Agricultural Data', index=False)
        output.seek(0)
        return send_file(output, 
                         mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                         as_attachment=True, 
                         attachment_filename='agricultural_report.xlsx')

    elif format == 'pdf':
        # Generate PDF file
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.drawString(100, 750, "Agricultural Report")
        y = 700
        for index, row in df.iterrows():
            p.drawString(100, y, f"{row['date']}: {row['crop']} - Yield: {row['yield']}, Area: {row['area']}")
            y -= 20
        p.showPage()
        p.save()
        buffer.seek(0)
        return send_file(buffer, 
                         mimetype='application/pdf', 
                         as_attachment=True, 
                         attachment_filename='agricultural_report.pdf')

    else:
        return jsonify({"error": "Invalid format. Use 'xlsx' or 'pdf'."}), 400

@app.route('/api/watson-query', methods=['POST'])
@jwt_required()
def query_watson():
    user_input = request.json.get('query')
    try:
        response = assistant.message(
            assistant_id=WATSON_ASSISTANT_ID,
            session_id=create_session(),
            input={
                'message_type': 'text',
                'text': user_input
            }
        ).get_result()
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_session():
    try:
        response = assistant.create_session(
            assistant_id=WATSON_ASSISTANT_ID
        ).get_result()
        return response['session_id']
    except Exception as e:
        print(f"Error creating Watson session: {str(e)}")
        return None

@app.route('/api/planning-calendar', methods=['POST'])
@jwt_required()
def get_planning_calendar():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    crops = data.get('crops')

    if not all([latitude, longitude, crops]):
        return jsonify({"error": "Missing required data"}), 400

    # This is a placeholder. In a real application, you would:
    # 1. Use the latitude and longitude to determine the climate zone
    # 2. Look up the optimal planting and harvesting times for each crop in that zone
    # 3. Generate a calendar based on this information

    calendar = []
    for crop in crops:
        calendar.append({
            "crop": crop,
            "plant_date": "2023-03-15",  # Placeholder date
            "harvest_date": "2023-09-15"  # Placeholder date
        })

    return jsonify(calendar), 200

@app.route('/api/soil-health', methods=['POST'])
@jwt_required()
def track_soil_health():
    data = request.json
    soil_type = data.get('soil_type')
    ph_level = data.get('ph_level')
    nitrogen = data.get('nitrogen')
    phosphorus = data.get('phosphorus')
    potassium = data.get('potassium')
    organic_matter = data.get('organic_matter')

    if not all([soil_type, ph_level, nitrogen, phosphorus, potassium, organic_matter]):
        return jsonify({"error": "Missing required data"}), 400

    health_score = (
        (7 - abs(7 - ph_level)) / 7 * 20 +
        min(nitrogen / 100, 1) * 20 +
        min(phosphorus / 100, 1) * 20 +
        min(potassium / 100, 1) * 20 +
        min(organic_matter / 5, 1) * 20
    )

    return jsonify({
        "soil_health_score": round(health_score, 2),
        "recommendations": [
            "Consider adding compost to improve organic matter content",
            f"The soil pH is {ph_level}. Ideal range is 6.0-7.0.",
            "Rotate crops to maintain soil health"
        ]
    }), 200

@app.route('/api/market-trends', methods=['GET'])
@jwt_required()
def analyze_market_trends():
    # This is a placeholder. In a real application, you would:
    # 1. Fetch real-time market data from an API
    # 2. Analyze historical price trends
    # 3. Consider factors like global supply and demand

    market_trends = [
        {"crop": "Wheat", "current_price": 7.5, "trend": "rising", "demand": "high"},
        {"crop": "Corn", "current_price": 6.2, "trend": "stable", "demand": "moderate"},
        {"crop": "Soybeans", "current_price": 14.3, "trend": "falling", "demand": "low"}
    ]

    return jsonify(market_trends), 200

@app.route('/api/risk-assessment', methods=['POST'])
@jwt_required()
def assess_risk():
    data = request.json
    crop = data.get('crop')
    location = data.get('location')
    planting_date = data.get('planting_date')

    if not all([crop, location, planting_date]):
        return jsonify({"error": "Missing required data"}), 400

    # This is a placeholder. In a real application, you would:
    # 1. Use historical weather data for the location
    # 2. Consider pest prevalence in the area
    # 3. Analyze market volatility for the crop

    risks = [
        {"type": "Weather", "risk_level": "medium", "details": "Potential for dry spell in mid-season"},
        {"type": "Pests", "risk_level": "low", "details": "No major pest outbreaks expected"},
        {"type": "Market", "risk_level": "high", "details": "Price volatility due to global supply changes"}
    ]

    return jsonify(risks), 200

@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    # In a real application, you would fetch this data from a database
    # and filter based on the current user
    notifications = [
        {
            "id": 1,
            "title": "Weather Warning",
            "message": "Heavy rainfall expected in your area in the next 48 hours.",
            "type": "weather",
            "severity": "high"
        },
        {
            "id": 2,
            "title": "Water Scarcity Alert",
            "message": "Water levels in local reservoirs are low. Consider water conservation measures.",
            "type": "water",
            "severity": "medium"
        }
    ]
    return jsonify(notifications), 200

if __name__ == '__main__':
    app.run(debug=True)