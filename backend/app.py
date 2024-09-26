from flask import Flask, request, jsonify, send_file
from flask_cors import CORS # type: ignore
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity # type: ignore
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random
import csv
from io import StringIO

import logging
import io
import pandas as pd
from reportlab.pdfgen import canvas # type: ignore
from reportlab.lib.pagesizes import letter # type: ignore

import os
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from dotenv import load_dotenv
from supabase import create_client, Client # type: ignore

# Load environment variables from .env file
load_dotenv(dotenv_path='../frontend/.env')

# Initialize Supabase client with credentials from .env
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Replace the users dictionary with a function to fetch users from Supabase
def get_user(username):
    response = supabase.table('profiles').select('*').eq('username', username).execute()
    return response.data[0] if response.data else None  # Return the first matching user or None

# Example usage
if (user := get_user("MAKANA")):  # Use named expression
    password = user['password']  # Access the hashed password

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'EEE2062rm!Ask73/RM'  # Change this!
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "EEE2062rm!Ask73/RM"  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
jwt = JWTManager(app)

# Fetch data from Supabase for all relevant tables
def get_climate_trends():
    response = supabase.table('climate_trends').select('*').execute()
    return response.data or []

def get_crop_data():
    response = supabase.table('crop_data').select('*').execute()
    return response.data or []

def get_farmer_profiles():
    response = supabase.table('farmer_profiles').select('*').execute()
    return response.data or []

def get_geographical_data():
    response = supabase.table('geographical_data').select('*').execute()
    return response.data or []

def get_historical_yield_data():
    response = supabase.table('historical_yield_data').select('*').execute()
    return response.data or []

def get_irrigation_data():
    response = supabase.table('irrigation_data').select('*').execute()
    return response.data or []

def get_market_data():
    response = supabase.table('market_data').select('*').execute()
    return response.data or []

def get_pest_and_disease_data():
    response = supabase.table('pest_and_disease_data').select('*').execute()
    return response.data or []

def get_projected_climate_changes():
    response = supabase.table('projected_climate_changes').select('*').execute()
    return response.data or []

def get_soil_data():
    response = supabase.table('soil_data').select('*').execute()
    return response.data or []

def get_sustainability_metrics():
    response = supabase.table('sustainability_metrics').select('*').execute()
    return response.data or []

def get_weather_data():
    response = supabase.table('weather_data').select('*').execute()
    return response.data or []

# Example usage
climate_trends = get_climate_trends()
crop_data = get_crop_data()
farmer_profiles = get_farmer_profiles()
geographical_data = get_geographical_data()
historical_yield_data = get_historical_yield_data()
irrigation_data = get_irrigation_data()
market_data = get_market_data()
pest_and_disease_data = get_pest_and_disease_data()
projected_climate_changes = get_projected_climate_changes()
soil_data = get_soil_data()
sustainability_metrics = get_sustainability_metrics()
weather_data = get_weather_data()

# Mock database of crops and their optimal conditions
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
    email = request.json.get('email', None)
    name = request.json.get('name', '')
    location = request.json.get('location', '')
    preferred_units = request.json.get('preferred_units', 'metric')

    if not username or not password or not email:
        return jsonify({"msg": "Missing required fields"}), 400
    
    if get_user(username):
        return jsonify({"msg": "Username already exists"}), 400
    
    hashed_password = generate_password_hash(password)
    
    try:
        response = supabase.table('profiles').insert({
            "username": username,
            "password": hashed_password,
            "email": email,
            "name": name,
            "location": location,
            "preferred_units": preferred_units
        }).execute()
        
        if response.data:
            return jsonify({"msg": "User created successfully"}), 201
        else:
            return jsonify({"msg": "Error creating user"}), 500
    except Exception as e:
        return jsonify({"msg": f"Error creating user: {str(e)}"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400

        username = request.json.get('username', None)
        password = request.json.get('password', None)
        print(f"Login attempt for user: {username}")

        if not username or not password:
            print("Error: Missing username or password")
            return jsonify({"msg": "Missing username or password"}), 400

        user = get_user(username)
        if not user:
            print(f"Error: User {username} not found")
            return jsonify({"msg": "User not found"}), 401

        if check_password_hash(user['password'], password):
            # Query the profiles table for additional user information
            profile_response = supabase.table('profiles').select('*').eq('username', username).execute()
            if profile_response.error:
                print(f"Error fetching profile for user: {username}")
                return jsonify({"msg": "Error fetching user profile"}), 500

            user_profile = profile_response.data[0] if profile_response.data else {}

            access_token = create_access_token(identity=username)
            print(f"Token generated: {access_token}")
            print(f"Login successful for user: {username}")
            return jsonify(access_token=access_token, user_profile=user_profile), 200
        else:
            print(f"Error: Incorrect password for user: {username}")
            return jsonify({"msg": "Invalid username or password"}), 401
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"msg": "An error occurred during login"}), 500

# Once a user is successfully logged in:
# 1. An access token is generated for the user using create_access_token()
# 2. This token is returned to the client in the response
# 3. The client should store this token (usually in local storage or a cookie)
# 4. For subsequent requests to protected routes, the client should include this token in the Authorization header
# 5. The server will use this token to authenticate the user for protected routes
# 6. The token expires after the time specified in JWT_ACCESS_TOKEN_EXPIRES (1 hour in this case)
# 7. The user can now access protected routes and perform actions specific to their account

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
@jwt_required()
def get_weather():
    response = supabase.table('weather_data').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching weather data"}), 500
    return jsonify(response.data), 200

@app.route('/api/soil', methods=['GET'])
@jwt_required()
def get_soil_data():
    response = supabase.table('soil_data').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching soil data"}), 500
    return jsonify(response.data), 200

@app.route('/api/crops', methods=['GET'])
@jwt_required()
def get_crops():
    response = supabase.table('crop_data').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching crop data"}), 500
    return jsonify(response.data), 200

@app.route('/api/pests', methods=['GET'])
@jwt_required()
def get_pests():
    response = supabase.table('pest_and_disease_data').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching pest and disease data"}), 500
    return jsonify(response.data), 200

@app.route('/api/irrigation', methods=['GET'])
@jwt_required()
def get_irrigation_data():
    response = supabase.table('irrigation_data').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching irrigation data"}), 500
    return jsonify(response.data), 200

@app.route('/api/climate-trends', methods=['GET'])
@jwt_required()
def get_climate_trends():
    response = supabase.table('climate_trends').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching climate trends"}), 500
    return jsonify(response.data), 200

@app.route('/api/historical-yield', methods=['GET'])
@jwt_required()
def get_historical_yield_data():
    response = supabase.table('historical_yield_data').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching historical yield data"}), 500
    return jsonify(response.data), 200

@app.route('/api/market-data', methods=['GET'])
@jwt_required()
def get_market_data():
    response = supabase.table('market_data').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching market data"}), 500
    return jsonify(response.data), 200

@app.route('/api/farmer-profiles', methods=['GET'])
@jwt_required()
def get_farmer_profiles():
    response = supabase.table('farmer_profiles').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching farmer profiles"}), 500
    return jsonify(response.data), 200

@app.route('/api/sustainability-metrics', methods=['GET'])
@jwt_required()
def get_sustainability_metrics():
    response = supabase.table('sustainability_metrics').select('*').execute()
    if response.error:
        return jsonify({"msg": "Error fetching sustainability metrics"}), 500
    return jsonify(response.data), 200

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

# Get admin username from environment variable
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")  # Default to 'admin' if not set

@app.route('/api/clear-users', methods=['POST'])
@jwt_required()
def clear_users():
    current_user = get_jwt_identity()
    if current_user != ADMIN_USERNAME:  # Use the environment variable
        return jsonify({"msg": "Unauthorized"}), 403

    supabase.table('users').delete().execute()
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

@app.route('/api/generate-report', methods=['GET'])
@jwt_required()
def generate_report():
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.drawString(100, 750, "Agricultural Data Report")
    
    # Add more content to the PDF
    y = 730
    for data in agricultural_data:  # Assuming agricultural_data is a list of dicts
        p.drawString(100, y, f"Date: {data['date']}, Crop: {data['crop']}, Yield: {data['yield']}")
        y -= 20

    p.showPage()
    p.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='agricultural_report.pdf', mimetype='application/pdf')

@app.route('/api/crop-yield-analysis', methods=['GET'])
@jwt_required()
def crop_yield_analysis():
    df = pd.DataFrame(historical_yield_data)  # Assuming historical_yield_data is a list of dicts
    yield_summary = df.groupby('crop')['yield'].agg(['mean', 'sum']).reset_index()
    return jsonify(yield_summary.to_dict(orient='records')), 200

@app.route('/api/export-agricultural-data', methods=['GET'])
@jwt_required()
def export_agricultural_data():
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['Date', 'Crop', 'Yield', 'Area'])  # Header

    for data in agricultural_data:  # Assuming agricultural_data is a list of dicts
        writer.writerow([data['date'], data['crop'], data['yield'], data['area']])

    output.seek(0)
    return send_file(io.BytesIO(output.getvalue().encode()), mimetype='text/csv', as_attachment=True, download_name='agricultural_data.csv')

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development')