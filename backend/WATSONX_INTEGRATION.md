# Integrating IBM watsonx Products into Python Backend

This guide explains how to integrate various IBM watsonx products into a Python backend application. We'll cover the setup and usage of watsonx.ai, watsonx.data, watsonx.governance, and Watson Assistant.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [watsonx.ai Integration](#watsonxai-integration)
3. [watsonx.data Integration](#watsonxdata-integration)
4. [watsonx.governance Integration](#watsonxgovernance-integration)
5. [Watson Assistant Integration](#watson-assistant-integration)

## Prerequisites

Before you begin, ensure you have the following:

- Python 3.7 or later installed
- pip package manager
- IBM Cloud account with access to watsonx services
- Necessary API keys and credentials for each service

Install the required Python packages:
```bash

pip install ibm-watson-machine-learning ibm-watson python-dotenv
```

## watsonx.ai Integration

### Setup
1. Create a file named `watsonx_integration.py` in your project.
2. Add the following code to set up the connection:

```python
import os
from ibm_watson_machine_learning import APIClient
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv('WATSONX_API_KEY')
URL = os.getenv('WATSONX_URL')
PROJECT_ID = os.getenv('WATSONX_PROJECT_ID')
wml_credentials = {
"url": URL,
"apikey": API_KEY
}
client = APIClient(wml_credentials)
client.set.default_project(PROJECT_ID)

```
### Usage

To get predictions from a deployed model:

```python
def get_prediction(input_data):
MODEL_ID = "your-model-id"
payload = {
"input_data": [
{
"fields": list(input_data.keys()),
"values": [list(input_data.values())]
}
]
}
try:
predictions = client.deployments.score(MODEL_ID, payload)
return predictions
except Exception as e:
print(f"An error occurred: {str(e)}")
return None
```

## watsonx.data Integration

watsonx.data is used for data querying and management.

### Setup

1. Create a file named `watsonx_data.py` in your project.
2. Add the following code to set up the connection:

```python
import os
from ibm_watson_machine_learning import APIClient
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv('WATSONX_DATA_API_KEY')
URL = os.getenv('WATSONX_DATA_URL')
PROJECT_ID = os.getenv('WATSONX_DATA_PROJECT_ID')
client = APIClient(
credentials={
"apikey": API_KEY,
"url": URL
}
)
client.set.default_project(PROJECT_ID)

```


### Usage

To execute SQL queries and manage datasets:

```python
def execute_sql_query(query):
try:
result = client.data_management.run_sql(query)
return result.result
except Exception as e:
print(f"An error occurred: {str(e)}")
return None
def list_datasets():
try:
datasets = client.data_management.list_data_assets()
return [dataset['metadata']['name'] for dataset in datasets['resources']]
except Exception as e:
print(f"An error occurred: {str(e)}")
return None
def create_dataset(name, description, sql_query):
try:
client.data_management.create_data_asset(
name=name,
description=description,
query=sql_query
)
return True
except Exception as e:
print(f"An error occurred: {str(e)}")
return False
```


## watsonx.governance Integration

watsonx.governance is used for model governance and compliance checks.

### Setup

1. Create a file named `watsonx_governance.py` in your project.
2. Add the following code to set up the connection:

```python
import os
from ibm_watson_machine_learning import APIClient
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv('WATSONX_GOV_API_KEY')
URL = os.getenv('WATSONX_GOV_URL')
SPACE_ID = os.getenv('WATSONX_GOV_SPACE_ID')
client = APIClient(
credentials={
"apikey": API_KEY,
"url": URL
}
)
client.set.default_space(SPACE_ID)
```


### Usage

To check model compliance and get model lineage:
```python
def check_model_compliance(model_id):
try:
model_details = client.repository.get_model_details(model_id)
compliance_check = client.governance.check_compliance(model_details)
return compliance_check
except Exception as e:
print(f"An error occurred: {str(e)}")
return None
def get_model_lineage(model_id):
try:
lineage = client.governance.get_model_lineage(model_id)
return lineage
except Exception as e:
print(f"An error occurred: {str(e)}")
return None
```

## Watson Assistant Integration

Watson Assistant is used for conversational AI capabilities.

### Setup

1. Create a file named `watson_assistant.py` in your project.
2. Add the following code to set up the connection:
```python
import os
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv('WATSON_ASSISTANT_API_KEY')
URL = os.getenv('WATSON_ASSISTANT_URL')
ASSISTANT_ID = os.getenv('WATSON_ASSISTANT_ID')
authenticator = IAMAuthenticator(API_KEY)
assistant = AssistantV2(
version='2021-06-14',
authenticator=authenticator
)
assistant.set_service_url(URL)
```
### Usage

To interact with Watson Assistant:
```python
def create_session():
response = assistant.create_session(assistant_id=ASSISTANT_ID).get_result()
return response['session_id']
def send_message(session_id, message):
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
assistant.delete_session(assistant_id=ASSISTANT_ID, session_id=session_id)
```

## Environment Variables

Ensure you have a `.env` file in your project root with the following variables:
```
WATSONX_API_KEY=your_watsonx_api_key
WATSONX_URL=your_watsonx_url
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_DATA_API_KEY=your_watsonx_data_api_key
WATSONX_DATA_URL=your_watsonx_data_url
WATSONX_DATA_PROJECT_ID=your_watsonx_data_project_id
WATSONX_GOV_API_KEY=your_watsonx_governance_api_key
WATSONX_GOV_URL=your_watsonx_governance_url
WATSONX_GOV_SPACE_ID=your_watsonx_governance_space_id
WATSON_ASSISTANT_API_KEY=your_watson_assistant_api_key
WATSON_ASSISTANT_URL=your_watson_assistant_url
WATSON_ASSISTANT_ID=your_watson_assistant_id
```

Replace the placeholder values with your actual API keys and URLs from your IBM Cloud account.

This setup allows you to integrate various IBM watsonx products into your Python backend. Remember to handle exceptions appropriately and implement proper error logging in a production environment.
