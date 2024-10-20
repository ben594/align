from app.models.project import Project
from app.models.role import Role
from app.models.image import Image
from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from azure.storage.blob import BlobServiceClient
from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename
import uuid

from ..models.project import Project
from ..models.image import Image

project_bp = Blueprint("projects", __name__)

AZURE_CONNECTION_STRING = os.getenv("AZURE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")
blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)

@project_bp.route("/projects/<int:id>", methods=["GET"])
def get_project(id):
    project = Project.get(id)
    if project:
        return (
            jsonify(
                {
                    "id": project.project_id,
                    "name": project.project_name,
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
    else:
        projects = []
        for role in ["labeler", "reviewer", "owner"]:
            projects.extend(Project.get_projects_by_role(user_id, role))

    projects_list = [
        {
            "role": role,
            "id": project.project_id,
            "name": project.project_name,
            "description": project.description,
            "vendorUID": project.vendor_uid,
            "totalNumImages": project.total_num_images,
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

    if (
        not vendor_uid
        or not project_name
        or not description
        or not price_per_image
    ):
        return jsonify({"error": "Invalid project parameters"}), 400

    project_id = Project.create(
        vendor_uid,
        project_name,
        description,
        price_per_image,
    )

    role = Role.create(vendor_uid, project_id, "owner")

    if project_id:
        return jsonify({"message": "Project created", "project_id": project_id}), 201
    return jsonify({"error": "Failed to create project"}), 500

@project_bp.route("/project/<int:project_id>/images", methods=["GET"])
def get_all_project_images_url(project_id):
    print("in controller")
    project_image_urls = Image.get_all_image_urls_per_project(project_id)
    return jsonify(project_image_urls), 200
    
# Route to upload multiple images to azure blob storage
@project_bp.route("/project/<int:project_id>/upload", methods=["POST"])
@jwt_required()
def upload_images(project_id):
    # TODO: ensure that vendor_uid is the owner/admin of the project
    vendor_uid = get_jwt_identity()

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
                return jsonify({"error": f"Failed to upload {file.filename}: {str(e)}"}), 500

    return jsonify({"imageUrls": uploaded_image_urls}), 200
