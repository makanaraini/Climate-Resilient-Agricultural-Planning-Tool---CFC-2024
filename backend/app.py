from flask import Flask, request, jsonify, session
from src.watson_assistant import create_session, send_message, delete_session
from src.api.routes import bp as api_bp
from src.watsonx_data import execute_sql_query, list_datasets, create_dataset, delete_dataset, get_dataset_info
from src.data_analysis import analyze_crop_data

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'your-secret-key')  # Set a secret key for sessions
app.register_blueprint(api_bp, url_prefix='/api')

MODEL_ID = "your-model-id"  # Replace with your actual model ID

@app.route('/')
def hello():
    return "Hello, World!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    result = get_prediction(data)
    if result:
        # Log the model usage for governance
        log_model_deployment(MODEL_ID, {"usage": "prediction", "input_data": data})
        return jsonify(result)
    else:
        return jsonify({"error": "Failed to get prediction"}), 500

@app.route('/model/compliance', methods=['GET'])
def model_compliance():
    compliance_results = check_model_compliance(MODEL_ID)
    if compliance_results:
        return jsonify(compliance_results)
    else:
        return jsonify({"error": "Failed to check model compliance"}), 500

@app.route('/model/lineage', methods=['GET'])
def model_lineage():
    lineage_info = get_model_lineage(MODEL_ID)
    if lineage_info:
        return jsonify(lineage_info)
    else:
        return jsonify({"error": "Failed to retrieve model lineage"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    # Check if there's an existing session, if not create one
    if 'watson_session_id' not in session:
        session['watson_session_id'] = create_session()
    
    # Send message to Watson Assistant
    response = send_message(session['watson_session_id'], user_message)
    
    # Extract the assistant's response
    if response['output']['generic']:
        assistant_response = response['output']['generic'][0]['text']
    else:
        assistant_response = "I'm sorry, I didn't understand that."
    
    return jsonify({
        "assistant_response": assistant_response
    })

@app.route('/end_chat', methods=['POST'])
def end_chat():
    if 'watson_session_id' in session:
        delete_session(session['watson_session_id'])
        session.pop('watson_session_id', None)
        return jsonify({"message": "Chat session ended"})
    else:
        return jsonify({"message": "No active chat session"})

@app.route('/query', methods=['POST'])
def query_data():
    data = request.json
    sql_query = data.get('query')
    if not sql_query:
        return jsonify({"error": "No SQL query provided"}), 400
    
    result = execute_sql_query(sql_query)
    if result is not None:
        return jsonify(result.to_dict(orient='records'))
    else:
        return jsonify({"error": "Failed to execute query"}), 500

@app.route('/datasets', methods=['GET'])
def get_datasets():
    datasets = list_datasets()
    if datasets:
        return jsonify(datasets)
    else:
        return jsonify({"error": "Failed to retrieve datasets"}), 500

@app.route('/datasets', methods=['POST'])
def create_new_dataset():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    sql_query = data.get('sql_query')
    
    if not all([name, description, sql_query]):
        return jsonify({"error": "Missing required parameters"}), 400
    
    success = create_dataset(name, description, sql_query)
    if success:
        return jsonify({"message": f"Dataset '{name}' created successfully"}), 201
    else:
        return jsonify({"error": "Failed to create dataset"}), 500

@app.route('/datasets/<name>', methods=['GET'])
def get_dataset_details(name):
    info = get_dataset_info(name)
    if info:
        return jsonify(info)
    else:
        return jsonify({"error": f"Failed to retrieve info for dataset '{name}'"}), 404

@app.route('/datasets/<name>', methods=['DELETE'])
def remove_dataset(name):
    success = delete_dataset(name)
    if success:
        return jsonify({"message": f"Dataset '{name}' deleted successfully"}), 200
    else:
        return jsonify({"error": f"Failed to delete dataset '{name}'"}), 500

@app.route('/analyze_crops', methods=['POST'])
def analyze_crops():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    results = analyze_crop_data(data)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)