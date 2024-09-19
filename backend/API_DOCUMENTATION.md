# Climate-Resilient Agricultural Planning Tool API Documentation

## Base URL

All URLs referenced in the documentation have the following base:

```
http://localhost:5000
```

## Endpoints

### 1. Root Endpoint

- **URL:** `/`
- **Method:** `GET`
- **Description:** A simple endpoint to check if the API is running.
- **Response:**
  - **Code:** 200 OK
  - **Content:** `"Hello, World!"`

### 2. Analyze Crop Data

- **URL:** `/analyze_crops`
- **Method:** `POST`
- **Description:** Analyzes crop yield data in relation to weather conditions.
- **Request Body:**
  ```json
  [
    {
      "year": 2020,
      "crop_type": "wheat",
      "yield": 3.2,
      "temperature": 25,
      "rainfall": 500
    },
    ...
  ]
  ```
- **Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "yield_statistics": {
        "count": 8.0,
        "mean": 6.5125,
        "std": 3.5957,
        "min": 2.8,
        "25%": 3.075,
        "50%": 6.05,
        "75%": 9.8,
        "max": 11.0
      },
      "weather_yield_correlation": {
        "temperature": -0.3436,
        "rainfall": 0.7651
      },
      "optimal_conditions": {
        "temperature": 26.0,
        "rainfall": 850.0
      },
      "crop_type_yields": {
        "corn": 9.9,
        "wheat": 3.125
      },
      "extreme_weather_years": [2022]
    }
    ```
- **Error Response:**
  - **Code:** 400 Bad Request
  - **Content:** `{"error": "No data provided"}`

### 3. Execute SQL Query

- **URL:** `/query`
- **Method:** `POST`
- **Description:** Executes a SQL query on watsonx.data.
- **Request Body:**
  ```json
  {
    "query": "SELECT * FROM your_table LIMIT 10"
  }
  ```
- **Response:**
  - **Code:** 200 OK
  - **Content:** Array of objects representing query results
- **Error Response:**
  - **Code:** 400 Bad Request
  - **Content:** `{"error": "No SQL query provided"}`
  - **Code:** 500 Internal Server Error
  - **Content:** `{"error": "Failed to execute query"}`

### 4. List Datasets

- **URL:** `/datasets`
- **Method:** `GET`
- **Description:** Lists all available datasets in watsonx.data.
- **Response:**
  - **Code:** 200 OK
  - **Content:** Array of dataset names
- **Error Response:**
  - **Code:** 500 Internal Server Error
  - **Content:** `{"error": "Failed to retrieve datasets"}`

### 5. Create Dataset

- **URL:** `/datasets`
- **Method:** `POST`
- **Description:** Creates a new dataset in watsonx.data.
- **Request Body:**
  ```json
  {
    "name": "new_dataset",
    "description": "Description of the new dataset",
    "sql_query": "SELECT * FROM source_table WHERE condition = 'value'"
  }
  ```
- **Response:**
  - **Code:** 201 Created
  - **Content:** `{"message": "Dataset 'new_dataset' created successfully"}`
- **Error Response:**
  - **Code:** 400 Bad Request
  - **Content:** `{"error": "Missing required parameters"}`
  - **Code:** 500 Internal Server Error
  - **Content:** `{"error": "Failed to create dataset"}`

### 6. Get Dataset Information

- **URL:** `/datasets/<name>`
- **Method:** `GET`
- **Description:** Retrieves information about a specific dataset.
- **URL Parameters:** `name` - Name of the dataset
- **Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "name": "dataset_name",
      "description": "Dataset description",
      "created_at": "2024-03-15T12:00:00Z",
      "asset_id": "asset_id_123",
      "size": "1.5 GB"
    }
    ```
- **Error Response:**
  - **Code:** 404 Not Found
  - **Content:** `{"error": "Failed to retrieve info for dataset 'dataset_name'"}`

### 7. Delete Dataset

- **URL:** `/datasets/<name>`
- **Method:** `DELETE`
- **Description:** Deletes a specific dataset from watsonx.data.
- **URL Parameters:** `name` - Name of the dataset to delete
- **Response:**
  - **Code:** 200 OK
  - **Content:** `{"message": "Dataset 'dataset_name' deleted successfully"}`
- **Error Response:**
  - **Code:** 500 Internal Server Error
  - **Content:** `{"error": "Failed to delete dataset 'dataset_name'"}`

### 8. Get Model Prediction

- **URL:** `/predict`
- **Method:** `POST`
- **Description:** Sends data to watsonx.ai and gets predictions.
- **Request Body:** JSON object containing input features (structure depends on your specific model)
- **Response:**
  - **Code:** 200 OK
  - **Content:** Prediction result (structure depends on your specific model)
- **Error Response:**
  - **Code:** 500 Internal Server Error
  - **Content:** `{"error": "Failed to get prediction"}`

### 9. Check Model Compliance

- **URL:** `/model/compliance`
- **Method:** `GET`
- **Description:** Checks compliance of the model using watsonx.governance.
- **Response:**
  - **Code:** 200 OK
  - **Content:** Compliance check results (structure depends on your governance setup)
- **Error Response:**
  - **Code:** 500 Internal Server Error
  - **Content:** `{"error": "Failed to check model compliance"}`

### 10. Get Model Lineage

- **URL:** `/model/lineage`
- **Method:** `GET`
- **Description:** Retrieves model lineage information from watsonx.governance.
- **Response:**
  - **Code:** 200 OK
  - **Content:** Model lineage information (structure depends on your governance setup)
- **Error Response:**
  - **Code:** 500 Internal Server Error
  - **Content:** `{"error": "Failed to retrieve model lineage"}`

### 11. Chat with Watson Assistant

- **URL:** `/chat`
- **Method:** `POST`
- **Description:** Sends a message to Watson Assistant and gets a response.
- **Request Body:**
  ```json
  {
    "message": "Hello, how can you help me with agricultural planning?"
  }
  ```
- **Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "assistant_response": "Hello! I'd be happy to help you with agricultural planning. What specific aspect would you like assistance with?"
    }
    ```
- **Error Response:**
  - **Code:** 400 Bad Request
  - **Content:** `{"error": "No message provided"}`

### 12. End Chat Session

- **URL:** `/end_chat`
- **Method:** `POST`
- **Description:** Ends the current chat session with Watson Assistant.
- **Response:**
  - **Code:** 200 OK
  - **Content:** `{"message": "Chat session ended"}`
- **Error Response:**
  - **Code:** 200 OK (This is not strictly an error)
  - **Content:** `{"message": "No active chat session"}`

## Authentication

This API currently does not implement authentication. It is recommended to add appropriate authentication and authorization mechanisms before deploying to a production environment.

## Rate Limiting

There are currently no rate limits imposed by the API itself. However, be aware that the underlying IBM watsonx services may have their own rate limits or usage quotas.

## Errors

The API uses conventional HTTP response codes to indicate the success or failure of an API request. In general:
- Codes in the `2xx` range indicate success.
- Codes in the `4xx` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, etc.).
- Codes in the `5xx` range indicate an error with our servers (these are rare).

In addition to the HTTP status code, error responses will contain a JSON object with an `error` key providing a human-readable explanation of what went wrong.
