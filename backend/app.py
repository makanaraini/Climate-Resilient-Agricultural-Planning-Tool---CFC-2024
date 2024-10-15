import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the path to the frontend/src/utils directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend/src/utils')))

# Access environment variables after loading
print("WATSONX_API_KEY:", os.getenv("WATSONX_API_KEY"))
print("WATSONX_URL:", os.getenv("WATSONX_URL"))
print("WATSONX_PROJECT_ID:", os.getenv("WATSONX_PROJECT_ID"))

from flask import Flask, request, jsonify, send_file, abort
from flask_cors import CORS  # type: ignore
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # type: ignore
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random
import csv
from io import StringIO

import logging
import io
import pandas as pd
from reportlab.pdfgen import canvas  # type: ignore
from reportlab.lib.pagesizes import letter  # type: ignore

from supabase import create_client, Client  # type: ignore
from ibm_watsonx_ai.foundation_models import Model
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames

# Access environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
WATSONX_API_KEY = os.getenv("WATSONX_API_KEY")
WATSONX_URL = os.getenv("WATSONX_URL")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_SPACE_ID = os.getenv("WATSONX_SPACE_ID")

# Initialize Supabase client with credentials from .env
url = os.getenv("REACT_APP_SUPABASE_URL")
key = os.getenv("REACT_APP_SUPABASE_ANON_KEY")  # Change this line to use the correct variable name

if not url or not key:
    raise ValueError("Supabase URL or key is missing from environment variables")

supabase: Client = create_client(url, key)

# Replace the users dictionary with a function to fetch users from Supabase
def get_user(username):
    try:
        response = supabase.table('profiles').select('*').eq('username', username).execute()
        return response.data[0] if response.data else None  # Return the first matching user or None
    except Exception as e:
        logging.error(f"Error fetching user: {str(e)}")
        return None

# Example usage
if (user := get_user("MAKANA")):  # Use named expression
    password = user['password']  # Access the hashed password

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default-secret-key')  # Use environment variable
jwt = JWTManager(app)

# Configure CORS
CORS(app, resources={
    r"/chatbot": {  # Adjust this to match your endpoint
        "origins": [
            "http://localhost:3000",
            "http://localhost:5000",  # This line is not necessary for CORS
            "https://your-production-domain.com",
            "https://api.watsonx.ai"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
}, supports_credentials=True)

# Setup the Flask-JWT-Extended extension
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=30)  # Changed to 30 days
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
jwt = JWTManager(app)

# Fetch data from Supabase for all relevant tables
def fetch_supabase_data(table_name):
    try:
        response = supabase.table(table_name).select('*').execute()
        if response.data is None:  # Check if data is None
            logging.error(f"Error fetching {table_name} data: {response.error}")
            return []
        return response.data or []
    except Exception as e:
        logging.error(f"Exception occurred while fetching {table_name} data: {str(e)}")
        return []

# Define functions to fetch data for each table
get_climate_trends = lambda: fetch_supabase_data('climate_trends')
get_crop_data = lambda: fetch_supabase_data('crop_data')
get_farmer_profiles = lambda: fetch_supabase_data('farmer_profiles')
get_geographical_data = lambda: fetch_supabase_data('geographical_data')
get_historical_yield_data = lambda: fetch_supabase_data('historical_yield_data')
get_irrigation_data = lambda: fetch_supabase_data('irrigation_data')
get_market_data = lambda: fetch_supabase_data('market_data')
get_pest_and_disease_data = lambda: fetch_supabase_data('pest_and_disease_data')
get_projected_climate_changes = lambda: fetch_supabase_data('projected_climate_changes')
get_soil_data = lambda: fetch_supabase_data('soil_data')
get_sustainability_metrics = lambda: fetch_supabase_data('sustainability_metrics')
get_weather_data = lambda: fetch_supabase_data('weather_data')

# Fetch data for all tables
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

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Function to get credentials for Watsonx API
def get_credentials():
    return {
        "url": "https://eu-gb.ml.cloud.ibm.com",  # Adjust the URL as necessary
        "apikey": os.getenv("WATSONX_API_KEY")  # Ensure this environment variable is set
    }

# Initialize the Watsonx Model
def initialize_model():
    model_id = "ibm/granite-13b-instruct-v2"  # Updated to a newer model
    parameters = {
        GenTextParamsMetaNames.DECODING_METHOD: "greedy",
        GenTextParamsMetaNames.MAX_NEW_TOKENS: 100,
        GenTextParamsMetaNames.MIN_NEW_TOKENS: 1,
        GenTextParamsMetaNames.TEMPERATURE: 0.7,
        GenTextParamsMetaNames.TOP_K: 50,
        GenTextParamsMetaNames.TOP_P: 1
    }

    project_id = os.getenv("WATSONX_PROJECT_ID")  # Ensure this environment variable is set

    return Model(
        model_id=model_id,
        params=parameters,
        credentials=get_credentials(),
        project_id=project_id
    )

model = initialize_model()

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_input = request.json.get('prompt')

    if not user_input:
        return jsonify({"error": "No prompt provided"}), 400

    # Define the prompt structure
    prompt_input = f"""Answer the following question using the best data available for climate-resilient planning:

    Question: {user_input}
    Answer:"""

    # Generate response from watsonx.ai model
    generated_response = model.generate_text(prompt=prompt_input)

    return jsonify({
        "response": generated_response
    })

@app.route('/chatbot', methods=['OPTIONS'])
def options_chatbot():
    return '', 200  # Respond with a 200 OK for preflight requests

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad Request", "message": str(error)}), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized", "message": "Authentication required"}), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({"error": "Forbidden", "message": "You don't have permission to access this resource"}), 403

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found", "message": "The requested resource was not found"}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred"}), 500

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/register', methods=['POST'])
def register():
    if not request.is_json:
        abort(400, description="Missing JSON in request")

    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        abort(400, description="Missing required fields")

    try:
        response = supabase.auth.sign_up({
            'email': email,
            'password': password
        })

        if response.error:
            abort(400, description=response.error.message)

        return jsonify({"msg": "User created successfully"}), 201
    except Exception as e:
        logging.error(f"Error during registration: {str(e)}")
        abort(500, description="An error occurred during registration")

@app.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        abort(400, description="Missing JSON in request")

    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        abort(400, description="Missing required fields")

    try:
        response = supabase.auth.sign_in_with_password({
            'email': email,
            'password': password
        })

        if response.error:
            logging.error(f"Login error: {response.error.message}")
            abort(401, description=response.error.message)

        access_token = create_access_token(identity=email)
        return jsonify({"access_token": access_token}), 200
    except Exception as e:
        logging.error(f"Error during login: {str(e)}")
        abort(500, description="An error occurred during login")

if __name__ == '__main__':
    app.run(debug=False)  # Changed debug mode to False for production
