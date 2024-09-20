from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.crop_data import CropData  # Adjust import path as needed
from ..services.dashboard_service import calculate_kpis
from ..services.ai_recommendation_service import get_ai_recommendations  # You'll need to create this

bp = Blueprint('api', __name__)

@bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "API is working"}), 200

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@bp.route('/version', methods=['GET'])
def version():
    return jsonify({"version": "1.0.0"}), 200

@bp.route('/farm-dashboard', methods=['GET'])
@jwt_required()
def farm_dashboard():
    current_user_id = get_jwt_identity()
    try:
        # Fetch data from your database
        crop_data = CropData.query.filter_by(user_id=current_user_id).all()

        # Convert crop_data to a list of dictionaries
        crop_data_list = [
            {
                'crop': data.crop,
                'yield': data.yield_amount,
                'area': data.area
            } for data in crop_data
        ]

        # Calculate KPIs
        kpis = calculate_kpis(crop_data)

        return jsonify({
            'kpis': kpis,
            'cropData': crop_data_list
        }), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching dashboard data'}), 500

@bp.route('/ai-recommendations', methods=['GET'])
@jwt_required()
def ai_recommendations():
    current_user_id = get_jwt_identity()
    try:
        crop_data = CropData.query.filter_by(user_id=current_user_id).all()
        recommendations = get_ai_recommendations(crop_data)
        return jsonify(recommendations), 200
    except Exception as e:
        return jsonify({'error': 'Error generating AI recommendations'}), 500

# Add other API routes here as needed

__all__ = ['bp']