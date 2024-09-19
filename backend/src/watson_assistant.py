import json
import os
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Watson Assistant credentials
API_KEY = os.getenv('WATSON_ASSISTANT_API_KEY')
URL = os.getenv('WATSON_ASSISTANT_URL')
ASSISTANT_ID = os.getenv('WATSON_ASSISTANT_ID')

# Set up the authenticator
authenticator = IAMAuthenticator(API_KEY)

# Create the assistant object
assistant = AssistantV2(
    version='2021-06-14',
    authenticator=authenticator
)

assistant.set_service_url(URL)

def create_session():
    """Create a new session with Watson Assistant"""
    response = assistant.create_session(assistant_id=ASSISTANT_ID).get_result()
    return response['session_id']

def send_message(session_id, message):
    """Send a message to Watson Assistant and get the response"""
    response = assistant.message(
        assistant_id=ASSISTANT_ID,
        session_id=session_id,
        input={
            'message_type': 'text',
            'text': message
        }
    ).get_result()
    
    return response

def delete_session(session_id):
    """Delete a session with Watson Assistant"""
    assistant.delete_session(assistant_id=ASSISTANT_ID, session_id=session_id)
