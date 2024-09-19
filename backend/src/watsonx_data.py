import os
import pandas as pd
from ibm_watson_machine_learning import APIClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# WatsonX Data credentials
API_KEY = os.getenv('WATSONX_DATA_API_KEY')
URL = os.getenv('WATSONX_DATA_URL')
PROJECT_ID = os.getenv('WATSONX_DATA_PROJECT_ID')

# For now, set client to None
client = None

def execute_sql_query(query):
    if not client:
        print("APIClient not initialized. Cannot execute query.")
        return None
    try:
        result = client.data_management.run_sql(query)
        return pd.DataFrame(result.result)
    except Exception as e:
        print(f"An error occurred while executing the query: {str(e)}")
        return None

def list_datasets():
    if not client:
        print("APIClient not initialized. Cannot list datasets.")
        return None
    try:
        datasets = client.data_management.list_data_assets()
        return [dataset['metadata']['name'] for dataset in datasets['resources']]
    except Exception as e:
        print(f"An error occurred while listing datasets: {str(e)}")
        return None

def create_dataset(name, description, sql_query):
    if not client:
        print("APIClient not initialized. Cannot create dataset.")
        return False
    try:
        client.data_management.create_data_asset(
            name=name,
            description=description,
            query=sql_query
        )
        return True
    except Exception as e:
        print(f"An error occurred while creating the dataset: {str(e)}")
        return False

def delete_dataset(name):
    if not client:
        print("APIClient not initialized. Cannot delete dataset.")
        return False
    try:
        datasets = client.data_management.list_data_assets()
        dataset_id = next((d['metadata']['asset_id'] for d in datasets['resources'] if d['metadata']['name'] == name), None)
        if dataset_id:
            client.data_management.delete_data_asset(dataset_id)
            return True
        else:
            print(f"Dataset '{name}' not found")
            return False
    except Exception as e:
        print(f"An error occurred while deleting the dataset: {str(e)}")
        return False

def get_dataset_info(name):
    if not client:
        print("APIClient not initialized. Cannot get dataset info.")
        return None
    try:
        datasets = client.data_management.list_data_assets()
        dataset = next((d for d in datasets['resources'] if d['metadata']['name'] == name), None)
        if dataset:
            return {
                "name": dataset['metadata']['name'],
                "description": dataset['metadata'].get('description', ''),
                "created_at": dataset['metadata']['created_at'],
                "asset_id": dataset['metadata']['asset_id'],
                "size": dataset['metadata'].get('size', 'Unknown')
            }
        else:
            print(f"Dataset '{name}' not found")
            return None
    except Exception as e:
        print(f"An error occurred while getting dataset info: {str(e)}")
        return None

# Example usage
if __name__ == "__main__":
    # Example: Execute a SQL query
    query_result = execute_sql_query("SELECT * FROM sample_table LIMIT 10")
    if query_result is not None:
        print(query_result)
    
    # Example: List datasets
    datasets = list_datasets()
    if datasets:
        print("Available datasets:", datasets)
    
    # Example: Create a new dataset
    new_dataset_created = create_dataset(
        "new_dataset",
        "This is a new dataset",
        "SELECT * FROM source_table WHERE condition = 'value'"
    )
    if new_dataset_created:
        print("New dataset created successfully")
    
    # Example: Get dataset info
    dataset_info = get_dataset_info("existing_dataset")
    if dataset_info:
        print("Dataset info:", dataset_info)
    
    # Example: Delete a dataset
    dataset_deleted = delete_dataset("dataset_to_delete")
    if dataset_deleted:
        print("Dataset deleted successfully")
