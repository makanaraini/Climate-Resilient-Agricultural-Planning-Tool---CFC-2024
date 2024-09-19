import json
import os
from ibm_watson_machine_learning import APIClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# WatsonX credentials
API_KEY = os.getenv('WATSONX_API_KEY')
URL = os.getenv('WATSONX_URL')
PROJECT_ID = os.getenv('WATSONX_PROJECT_ID')

# Initialize the API client
wml_credentials = {
    "url": URL,
    "apikey": API_KEY
}

client = APIClient(wml_credentials)

# Set project
client.set.default_project(PROJECT_ID)

# Define the model ID (replace with your actual model ID)
MODEL_ID = "your-model-id"

def get_prediction(input_data):
    """
    Send data to watsonx.ai and get predictions
    
    :param input_data: Dictionary containing input features
    :return: Prediction result
    """
    # Prepare the payload
    payload = {
        "input_data": [
            {
                "fields": list(input_data.keys()),
                "values": [list(input_data.values())]
            }
        ]
    }

    # Get predictions
    try:
        predictions = client.deployments.score(MODEL_ID, payload)
        return predictions
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None
