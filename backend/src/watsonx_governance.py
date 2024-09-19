import os
from ibm_watson_machine_learning import APIClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# WatsonX Governance credentials
API_KEY = os.getenv('WATSONX_GOV_API_KEY')
URL = os.getenv('WATSONX_GOV_URL')
SPACE_ID = os.getenv('WATSONX_GOV_SPACE_ID')

# Initialize the API client
wml_credentials = {
    "url": URL,
    "apikey": API_KEY
}

client = APIClient(wml_credentials)

# Set space
client.set.default_space(SPACE_ID)

def check_model_compliance(model_id):
    """
    Check model compliance using watsonx.governance
    
    :param model_id: ID of the model to check
    :return: Compliance check results
    """
    try:
        # Get model details
        model_details = client.repository.get_model_details(model_id)
        
        # Perform compliance check
        compliance_check = client.governance.check_compliance(model_details)
        
        return compliance_check
    except Exception as e:
        print(f"An error occurred during compliance check: {str(e)}")
        return None

def get_model_lineage(model_id):
    """
    Retrieve model lineage information
    
    :param model_id: ID of the model
    :return: Model lineage information
    """
    try:
        lineage = client.governance.get_model_lineage(model_id)
        return lineage
    except Exception as e:
        print(f"An error occurred while retrieving model lineage: {str(e)}")
        return None

def log_model_deployment(model_id, deployment_details):
    """
    Log model deployment for auditing purposes
    
    :param model_id: ID of the deployed model
    :param deployment_details: Dictionary containing deployment information
    :return: Success status
    """
    try:
        client.governance.log_deployment(model_id, deployment_details)
        return True
    except Exception as e:
        print(f"An error occurred while logging deployment: {str(e)}")
        return False

# Example usage
if __name__ == "__main__":
    MODEL_ID = "your-model-id"
    
    # Check model compliance
    compliance_results = check_model_compliance(MODEL_ID)
    if compliance_results:
        print("Compliance check results:")
        print(compliance_results)
    
    # Get model lineage
    lineage_info = get_model_lineage(MODEL_ID)
    if lineage_info:
        print("Model lineage:")
        print(lineage_info)
    
    # Log model deployment
    deployment_info = {
        "environment": "production",
        "version": "1.0",
        "deployed_by": "John Doe",
        "deployment_date": "2024-03-15"
    }
    if log_model_deployment(MODEL_ID, deployment_info):
        print("Deployment logged successfully")
    else:
        print("Failed to log deployment")
