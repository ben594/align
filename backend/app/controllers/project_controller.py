from app.models.project import Project
from app.models.role import Role
from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity


project_bp = Blueprint("projects", __name__)


@project_bp.route("/projects/<int:id>", methods=["GET"])
def get_project(id):
    project = Project.get(id)
    if project:
        return (
            jsonify(
                {
                    "id": project.project_id,
                    "name": project.project_name,
                    "deadline": project.deadline,
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
            "deadline": project.deadline,
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
    total_num_images = request.form.get("totalNumImages")
    deadline = request.form.get("deadline")

    if (
        not vendor_uid
        or not project_name
        or not description
        or not price_per_image
        or not total_num_images
    ):
        return jsonify({"error": "Invalid project parameters"}), 400

    project_id = Project.create(
        vendor_uid,
        project_name,
        description,
        price_per_image,
        total_num_images,
        deadline,
    )

    role = Role.create(vendor_uid, project_id, "owner")

    if project_id:
        return jsonify({"message": "Project created", "project_id": project_id}), 201
    return jsonify({"error": "Failed to create project"}), 500
