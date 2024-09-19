import json
import pytest
from app import app
from src.data_analysis import analyze_crop_data

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_hello_endpoint(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.data == b"Hello, World!"

def test_analyze_crops_success(client):
    sample_data = [
        {"year": 2020, "crop_type": "wheat", "yield": 3.2, "temperature": 25, "rainfall": 500},
        {"year": 2021, "crop_type": "corn", "yield": 9.5, "temperature": 28, "rainfall": 800}
    ]
    response = client.post('/analyze_crops', json=sample_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "yield_statistics" in data
    assert "weather_yield_correlation" in data
    assert "optimal_conditions" in data
    assert "crop_type_yields" in data
    assert "extreme_weather_years" in data

def test_analyze_crops_no_data(client):
    response = client.post('/analyze_crops', json=[])
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data["error"] == "No data provided"

def test_query_data_success(client, mocker):
    mock_execute_sql_query = mocker.patch('src.watsonx_data.execute_sql_query')
    mock_execute_sql_query.return_value = [{"column1": "value1", "column2": "value2"}]
    
    response = client.post('/query', json={"query": "SELECT * FROM table"})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]["column1"] == "value1"
    assert data[0]["column2"] == "value2"

def test_query_data_no_query(client):
    response = client.post('/query', json={})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data["error"] == "No SQL query provided"

def test_get_datasets_success(client, mocker):
    mock_list_datasets = mocker.patch('src.watsonx_data.list_datasets')
    mock_list_datasets.return_value = ["dataset1", "dataset2"]
    
    response = client.get('/datasets')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert "dataset1" in data
    assert "dataset2" in data

def test_get_datasets_failure(client, mocker):
    mock_list_datasets = mocker.patch('src.watsonx_data.list_datasets')
    mock_list_datasets.return_value = None
    
    response = client.get('/datasets')
    assert response.status_code == 500
    data = json.loads(response.data)
    assert data["error"] == "Failed to retrieve datasets"

def test_create_dataset_success(client, mocker):
    mock_create_dataset = mocker.patch('src.watsonx_data.create_dataset')
    mock_create_dataset.return_value = True
    
    response = client.post('/datasets', json={
        "name": "new_dataset",
        "description": "Test dataset",
        "sql_query": "SELECT * FROM source_table"
    })
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["message"] == "Dataset 'new_dataset' created successfully"

def test_create_dataset_missing_params(client):
    response = client.post('/datasets', json={
        "name": "new_dataset"
    })
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data["error"] == "Missing required parameters"

def test_delete_dataset_success(client, mocker):
    mock_delete_dataset = mocker.patch('src.watsonx_data.delete_dataset')
    mock_delete_dataset.return_value = True
    
    response = client.delete('/datasets/test_dataset')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["message"] == "Dataset 'test_dataset' deleted successfully"

def test_delete_dataset_failure(client, mocker):
    mock_delete_dataset = mocker.patch('src.watsonx_data.delete_dataset')
    mock_delete_dataset.return_value = False
    
    response = client.delete('/datasets/nonexistent_dataset')
    assert response.status_code == 500
    data = json.loads(response.data)
    assert data["error"] == "Failed to delete dataset 'nonexistent_dataset'"
