from flask import Blueprint, jsonify

bp = Blueprint('api', __name__)

@bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "API is working"}), 200

# Add other API routes here as needed

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@bp.route('/version', methods=['GET'])
def version():
    return jsonify({"version": "1.0.0"}), 200

# Add other API routes here

__all__ = ['bp']