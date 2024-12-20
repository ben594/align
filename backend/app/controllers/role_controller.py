from flask import Blueprint, jsonify, redirect, url_for, request, make_response
from flask_login import logout_user
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies, get_jwt_identity

from azure.storage.blob import BlobServiceClient

from ..models.user import User
from ..models.project import Project
import uuid
import os
from ..models.role import Role

bp = Blueprint("roles", __name__)
# Controller for everything related to the roles table

# Updates a user's role
@bp.route("/roles/update", methods=["POST"])
@jwt_required()
def update_role():
    data = request.get_json()
    user_id = data.get("user_id")
    project_id = data.get("project_id")
    role_name = data.get("role_name")

    if Role.get(get_jwt_identity(), project_id).role_name not in ("owner", "admin"):
        return jsonify({"error": "Unauthorized"}), 403

    if not user_id or not project_id or not role_name:
        return jsonify({"error": "Missing required parameters"}), 400

    success = Role.update(user_id, project_id, role_name)

    if success:
        return jsonify({"message": "Role updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update role"}), 500

# Deletes a user's role
@bp.route("/roles/delete", methods=["POST"])
@jwt_required()
def delete_role():
    data = request.get_json()
    user_id = data.get("user_id")
    project_id = data.get("project_id")

    if Role.get(get_jwt_identity(), project_id).role_name not in ("owner", "admin"):
        return jsonify({"error": "Unauthorized"}), 403

    if not user_id or not project_id:
        return jsonify({"error": "Missing required parameters"}), 400

    success = Role.delete(user_id, project_id)

    if success:
        return jsonify({"message": "Role deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to delete role"}), 500

# Creates a new role
@bp.route("/roles/create", methods=["POST"])
@jwt_required()
def create_role():
    data = request.get_json()
    email = data.get("email")
    project_id = data.get("project_id")
    role_name = data.get("role_name")

    if not email or not project_id or not role_name:
        return jsonify({"error": "Missing required parameters"}), 400

    if Role.get(get_jwt_identity(), project_id).role_name not in ("owner", "admin"):
        return jsonify({"error": "Unauthorized"}), 403

    user_id = User.get_id_from_email(email)
    if not user_id:
        return jsonify({"error": "User not found"}), 404
    
    if Role.get(user_id, project_id):
        return jsonify({"error": "User is already a member of this project"}), 400

    Role.create(user_id, project_id, role_name)
    return jsonify({"message": "Role created successfully"}), 201
