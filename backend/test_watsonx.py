import os
from ibm_watson_machine_learning import APIClient # type: ignore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up your credentials
api_key = os.getenv('WATSONX_API_KEY')
project_id = os.getenv('WATSONX_PROJECT_ID')

print(f"API Key: {api_key[:5]}...{api_key[-5:] if len(api_key) > 10 else ''}")
print(f"Project ID: {project_id}")

# Initialize the API client
wml_credentials = {
    "url": "https://eu-gb.ml.cloud.ibm.com",
    "apikey": api_key
}

client = APIClient(wml_credentials)

# Check if the project ID exists and set it
if project_id:
    try:
        client.set.default_project(project_id)
        print(f"\nSuccessfully set project: {project_id}")
    except Exception as e:
        print(f"\nError setting project: {str(e)}")
else:
    print("No project ID found in environment variables.")
