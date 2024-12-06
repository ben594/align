from app.models.image import Image
from flask import jsonify, Blueprint
from flask_jwt_extended import jwt_required

# Controller for anything related to images
image_bp = Blueprint("images", __name__)

# Gets all image data
@image_bp.route("/images/<int:image_id>", methods=["GET"])
@jwt_required()
def get_image(image_id):
    image = Image.get(image_id)
    if image:
        return (
            jsonify(
                {
                    "imageID": image.image_id,
                    "imageURL": image.image_url,
                    "projectID": image.project_id,
                    "labeledStatus": image.labeled_status,
                    "acceptedStatus": image.accepted_status,
                    "labelerUID": image.labeler_uid,
                    "labelText": image.label_text,
                }
            ),
            200,
        )
    return jsonify({f"error": "Error getting image {image_id}"}), 400

# Gets all images of a project based on project id
@image_bp.route("/images/project/<int:project_id>", methods=["GET"])
@jwt_required()
def get_images_by_project(project_id):
    images = Image.get_all_images_per_project(project_id)
    if images:
        images_list = [
            {
                "imageID": image.image_id,
                "imageURL": image.image_url,
                "projectID": image.project_id,
                "labeledStatus": image.labeled_status,
                "acceptedStatus": image.accepted_status,
                "labelerUID": image.labeler_uid,
                "labelText": image.label_text,
            }
            for image in images
        ]

        return jsonify(images=images_list), 200
    return jsonify({f"error": "Error getting images for project {project_id}"}), 400

# Gets next image for labeling flow
@image_bp.route("/images/next/<int:project_id>", methods=["GET"])
@jwt_required()
def get_next_image(project_id):
    image = Image.get_next_image(project_id)
    if image:
        return (
            jsonify(
                {
                    "imageID": image.image_id,
                    "imageURL": image.image_url,
                    "projectID": image.project_id,
                    "labeledStatus": image.labeled_status,
                    "acceptedStatus": image.accepted_status,
                    "labelerUID": image.labeler_uid,
                    "labelText": image.label_text,
                }
            ),
            200,
        )
    return jsonify({f"error": "Error getting image {image_id}"}), 400

# Gets metrics of a project based on project id
@image_bp.route("/project/<int:project_id>/metrics", methods=["GET"])
def get_project_metrics(project_id):
    metrics = Image.get_project_metrics(project_id)
    return jsonify(metrics), 200

# Gets next image for reviewing flow
@image_bp.route("/images/next/review/<int:project_id>", methods=["GET"])
@jwt_required()
def get_next_image_review(project_id):
    image = Image.get_next_image_review(project_id)
    if image:
        return (
            jsonify(
                {
                    "imageID": image.image_id,
                    "imageURL": image.image_url,
                    "projectID": image.project_id,
                    "labeledStatus": image.labeled_status,
                    "acceptedStatus": image.accepted_status,
                    "labelerUID": image.labeler_uid,
                    "labelText": image.label_text,
                }
            ),
            200,
        )
    return jsonify({f"error": "Error getting image {image_id}"}), 400
