from app.models.image import Image
from flask import jsonify, Blueprint
from flask_jwt_extended import jwt_required


image_bp = Blueprint("images", __name__)


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
