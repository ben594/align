# from backend.app.models.label import Label
from app.models.label import Label
from flask import Blueprint, jsonify, request


label_bp = Blueprint('labels', __name__)

@label_bp.route("/labels", methods=['POST'])
def create_label():
    data = request.get_json()
    user_id = data.get("user_id")
    image_id = data.get("image_id")
    response = data.get("response")
    
    if not user_id:
        return jsonify({'error': 'No user id'}), 400
    
    if not image_id:
        return jsonify({'error': 'No image id'}), 400
    
    if not response:
        return jsonify({'error': 'No response'}), 400

    new_label = Label.create(user_id, image_id, response)

    if new_label:
        return jsonify({'message': 'Label created', 'label': new_label}), 201
    return jsonify({'error': 'Failed to create label'}), 500