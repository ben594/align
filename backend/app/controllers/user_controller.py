from flask import Blueprint, jsonify, redirect, url_for, request, make_response, abort
from flask_login import logout_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from azure.storage.blob import BlobServiceClient

from ..models.user import User
from ..models.project import Project
from ..models.image import Image
from ..models.payment import Payment
import uuid
import os

bp = Blueprint("users", __name__)

AZURE_CONNECTION_STRING = os.getenv("AZURE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")
blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)

@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.get_by_auth(email, password)
    if user is None:
        return jsonify({"error": "Failed to login"}), 400

    access_token = create_access_token(identity=user.user_id, expires_delta=False)
    return jsonify(access_token=access_token, user_id=user.user_id), 200


@bp.route("/signup", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    if User.email_exists(email):
        return jsonify({"error": "Account with email already exists."}), 400

    user_id = User.register(email, password, firstname, lastname)
    access_token = create_access_token(identity=user_id, expires_delta=False)
    return jsonify(access_token=access_token, user_id=user_id), 200


@bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    logout_user()
    return jsonify({"message": "User logged out successfully"}), 200

@bp.route("/subtract_from_balance/<amount>", methods=["POST"])
@jwt_required()
def subtract_from_balance(amount):
    user_id = get_jwt_identity()
    User.subtract_from_balance(user_id, amount)
    return jsonify({"message": "Payment received"}), 200

@bp.route("/profile/<int:user_id>/stats", methods=["GET"])
@jwt_required()
def get_user_stats(user_id):
    num_accepted_labels = User.get_accepted_label_count(user_id)
    balance = User.get_balance(user_id)
    return jsonify({
        'num_accepted_labels': num_accepted_labels,
        'balance': balance
        }), 200

@bp.route("/profile/<int:user_id>/user_name", methods=["GET"])
@jwt_required()
def get_user_name(user_id):
    user_name = User.get_user_name(user_id)
    return jsonify(user_name), 200

@bp.route("/profile/<int:user_id>/email", methods=["GET"])
@jwt_required()
def get_email(user_id):
    email = User.get_email(user_id)
    return jsonify(email), 200

@bp.route("/profile/<int:user_id>/profile_image", methods=["GET"])
@jwt_required()
def get_profile_image(user_id):
    profile_image_url = User.get_profile_image(user_id)
    return jsonify(profile_image_url), 200

@bp.route("/profile/<int:user_id>/clear_profile_image", methods=["POST"])
@jwt_required()
def clear_profile_image(user_id):
    User.update_profile_image(user_id, None)
    return jsonify({}), 200

@bp.route("/profile/<int:user_id>/upload_profile_image", methods=["POST"])
@jwt_required()
def upload_profile_image(user_id):
    file = request.files['profile_image']
    unique_filename = str(uuid.uuid4()) + "_" + file.filename

    blob_client = blob_service_client.get_blob_client(container=AZURE_CONTAINER_NAME, blob=unique_filename)

    try:
        blob_client.upload_blob(file, overwrite=True)

        image_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{AZURE_CONTAINER_NAME}/{unique_filename}"

        success = User.update_profile_image(user_id, image_url)
        
        if not success:
            return jsonify({"error": "Failed to update profile image in the database"}), 400

        return jsonify({"message": "Profile image updated successfully", "avatarUrl": image_url}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to upload image: {str(e)}"}), 500

@bp.route("/user/<int:user_id>/projects", methods=["GET"])
@jwt_required()
def get_user_projects(user_id):
    projects = Project.get_vendor_projects(user_id)
    projects_list = [
        {
            "id": project.project_id,
            "name": project.project_name,
            "description": project.description,
            "vendorUID": project.vendor_uid,
            "pricePerImage": project.price_per_image,
        }
        for project in projects
    ]
    
    return jsonify(projects=projects_list), 200

@bp.route("/user/<int:user_id>/labels", methods=["GET"])
@jwt_required()
def get_user_labels(user_id):
    labels = Image.get_user_labels(user_id)
    label_list = [
        {
            "project_id": label.project_id,
            "accepted_status": label.accepted_status,
            "label_text": label.label_text
        }
        for label in labels
    ]
    return jsonify(labels=label_list), 200

@bp.route("/user/<int:user_id>/payments", methods=["GET"])
@jwt_required()
def get_user_payments(user_id):
    request_user_id = get_jwt_identity()
    if request_user_id != user_id:
        abort(403)
        return
    
    payments = Payment.get_all_by_uid(user_id)
    payments_list = [
        {
            "id": payment.transaction_id,
            "userID": payment.balance_change,
            "senderID": payment.sender_id,
            "transactionTime": payment.transaction_time,
            "balanceChange": payment.balance_change 
        }
        for payment in payments
    ]
    
    return jsonify(payments=payments_list), 200
