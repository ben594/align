from app.models.project import Project
from app.models.role import Role
from app.models.image import Image
from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from azure.storage.blob import BlobServiceClient
from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import uuid
import json

from ..models.project import Project
from ..models.role import Role
from ..models.image import Image

project_bp = Blueprint("projects", __name__)

AZURE_CONNECTION_STRING = os.getenv("AZURE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")
blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)


@project_bp.route("/projects/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    project = Project.get(project_id)
    user_id = get_jwt_identity()
    role = Role.get(user_id, project_id)

    if project:
        return (
            jsonify(
                {
                    "role": role.role_name if role else None,
                    "vendorUid": project.vendor_uid,
                    "id": project.project_id,
                    "name": project.project_name,
                    "description": project.description,
                    "pricePerImage": project.price_per_image,
                }
            ),
            200,
        )
    return jsonify({"error": "Project not found"}), 404


@project_bp.route("/projects", methods=["GET"])
@jwt_required()
def get_projects_by_role():
    user_id = get_jwt_identity()
    role = request.args.get("role")

    if role:
        projects = Project.get_projects_by_role(user_id, role)
        for project in projects:
            projects.role = role
    else:
        projects = []
        for role in ["labeler", "reviewer", "owner"]:
            projects_by_role = Project.get_projects_by_role(user_id, role)
            for project in projects_by_role:
                project.role = role
            projects.extend(projects_by_role)

    projects_list = [
        {
            "role": project.role,
            "id": project.project_id,
            "name": project.project_name,
            "description": project.description,
            "vendorUID": project.vendor_uid,
            "pricePerImage": project.price_per_image,
        }
        for project in projects
    ]

    return jsonify(projects=projects_list), 200


@project_bp.route("/projects/all", methods=["GET"])
@jwt_required()
def get_all_projects():
    projects = Project.get_all_projects()

    for project in projects:
        role = Role.get(get_jwt_identity(), project.project_id)
        project.role = role.role_name if role else None

    projects_list = [
        {
            "role": project.role,
            "id": project.project_id,
            "name": project.project_name,
            "description": project.description,
            "vendorUID": project.vendor_uid,
            "pricePerImage": project.price_per_image,
        }
        for project in projects
    ]

    return jsonify(projects=projects_list), 200


@project_bp.route("/projects", methods=["POST"])
@jwt_required()
def create_project():
    vendor_uid = get_jwt_identity()
    project_name = request.form.get("projectName")
    description = request.form.get("description")
    price_per_image = request.form.get("pricePerImage")
    tags = request.form.get("tags")

    if not vendor_uid or not project_name or not description or not price_per_image:
        return jsonify({"error": "Invalid project parameters"}), 400

    tags_list = json.loads(tags) if tags else []

    project_id = Project.create(
        vendor_uid,
        project_name,
        description,
        price_per_image,
        tags_list,
    )

    role = Role.create(vendor_uid, project_id, "owner")

    if project_id:
        return jsonify({"message": "Project created", "project_id": project_id}), 201
    return jsonify({"error": "Failed to create project"}), 500

@project_bp.route("/project/<int:project_id>/join", methods=["POST"])
@jwt_required()
def join_project(project_id):
    vendor_uid = get_jwt_identity()

    role = Role.create(vendor_uid, project_id, "labeler")

    return jsonify({"message": "Added to project", "project_id": project_id}), 201


@project_bp.route("/project/<int:project_id>/images", methods=["GET"])
def get_all_project_images_url(project_id):
    images = Image.get_all_images_per_project(project_id)
    image_data = [
        {
            "image_url": image.image_url,
            "label": image.label_text,
            "labeled_status": image.labeled_status,
            "accepted_status": image.accepted_status,
        }
        for image in images
    ]
    return jsonify(image_data), 200

@project_bp.route("/project/<int:project_id>/tags", methods=["GET"])
@jwt_required()
def get_project_tags(project_id):
    tags = Project.get_all_tags(project_id)
    print(tags)
    return jsonify(tags=tags), 200

# Route to upload multiple images to azure blob storage
@project_bp.route("/project/<int:project_id>/upload", methods=["POST"])
@jwt_required()
def upload_images(project_id):
    # TODO: ensure that user_id is the owner/admin of the project
    user_id = get_jwt_identity()

    if not Project.is_owner(user_id, project_id):
        return (
            jsonify(
                {"error": "You are not authorized to upload images to this project"}
            ),
            403,
        )

    files = request.files.getlist("images")
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    uploaded_image_urls = []
    for file in files:
        if file:
            # Generate a unique filename using UUID to avoid conflicts
            filename = secure_filename(file.filename)
            unique_filename = str(uuid.uuid4()) + "_" + filename

            # Upload the image to Azure Blob Storage
            blob_client = blob_service_client.get_blob_client(
                container=AZURE_CONTAINER_NAME, blob=unique_filename
            )

            try:
                # Upload the image data
                blob_client.upload_blob(file, overwrite=True)

                # Construct the image URL
                image_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{AZURE_CONTAINER_NAME}/{unique_filename}"

                # Insert a new row into the Images table
                Image.upload(image_url=image_url, project_id=project_id)
                uploaded_image_urls.append(image_url)

            except Exception as e:
                print(e)
                return (
                    jsonify({"error": f"Failed to upload {file.filename}: {str(e)}"}),
                    500,
                )

    return jsonify({"imageUrls": uploaded_image_urls}), 200
