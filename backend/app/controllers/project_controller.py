from app.models.project import Project
from flask import jsonify, request, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


project_bp = Blueprint("projects", __name__)


@project_bp.route("/projects/<int:id>", methods=["GET"])
def get_project(id):
    project = Project.get(id)
    if project:
        return (
            jsonify(
                {"id": project.id, "name": project.name, "deadline": project.deadline}
            ),
            200,
        )
    return jsonify({"error": "Project not found"}), 404


@project_bp.route("/projects/vendor", methods=["GET"])
@jwt_required()
def get_vendor_projects():
    user_id = get_jwt_identity()
    vendor_projects = Project.get_vendor_projects(user_id)

    projects_list = [
        {
            "project_id": project.project_id,
            "name": project.name,
            "description": project.description,
        }
        for project in vendor_projects
    ]

    return jsonify(projects=projects_list), 200


@project_bp.route("/projects", methods=["POST"])
@jwt_required()
def create_project():
    data = request.get_json()
    vendor_uid = get_jwt_identity()
    project_name = data.get("projectName")
    description = data.get("description")
    price_per_image = data.get("pricePerImage")
    total_num_images = data.get("totalNumImages")
    deadline = data.get("deadline")

    if (
        not vendor_uid
        or not project_name
        or not description
        or not price_per_image
        or not total_num_images
    ):
        return jsonify({"error": "Invalid project parameters"}), 400

    new_project = Project.create(
        vendor_uid,
        project_name,
        description,
        price_per_image,
        total_num_images,
        deadline,
    )

    if new_project:
        return jsonify({"message": "Project created", "project": new_project}), 201
    return jsonify({"error": "Failed to create project"}), 500
