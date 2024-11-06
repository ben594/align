from flask import Blueprint, jsonify, redirect, url_for, request, make_response
from flask_login import logout_user
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies

from azure.storage.blob import BlobServiceClient

from ..models.user import User
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
# @jwt_required()
def logout():
    logout_user()
    return jsonify({"message": "User logged out successfully"}), 200


@bp.route("/profile/<int:user_id>/stats", methods=["GET"])
# @jwt_required()
def get_user_stats(user_id):
    num_accepted_labels = User.get_accepted_label_count(user_id)
    balance = User.get_balance(user_id)
    return jsonify({
        'num_accepted_labels': num_accepted_labels,
        'balance': balance
        }), 200

@bp.route("/profile/<int:user_id>/user_name", methods=["GET"])
# @jwt_required()
def get_user_name(user_id):
    uid = request.args.get(user_id)
    user_name = User.get_user_name(user_id)
    print(user_name)
    return jsonify(user_name), 200

@bp.route("/profile/<int:user_id>/profile_image", methods=["GET"])
# @jwt_required()
def get_profile_image(user_id):
    profile_image_url = User.get_profile_image(user_id)
    return jsonify(profile_image_url), 200

@bp.route("/profile/<int:user_id>/clear_profile_image", methods=["POST"])
# @jwt_required()
def clear_profile_image(user_id):
    User.update_profile_image(user_id, None)
    return jsonify({}), 200

@bp.route("/profile/<int:user_id>/upload_profile_image", methods=["POST"])
# @jwt_required()
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
