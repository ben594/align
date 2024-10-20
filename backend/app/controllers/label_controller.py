from flask import Blueprint, jsonify, redirect, url_for, request, make_response
from flask_login import logout_user
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies

from ..models.user import User

bp = Blueprint("label", __name__)


@bp.route("/label/projectId", methods=["POST"])
@jwt_required()
def submit_label():
    labeler_uid = get_jwt_identity()
    projectID = request.form.get("projectID")
    imageURL = request.form.get("imageURL")
    label = request.form.get("label")
    
    if (
        not labeler_uid
        or not projectID
        or not image
        or not label
    ):
        return jsonify({"error": "Invalid image label parameters"}), 400

    #connect to models
    label_id = Label.create(
        vendor_uid,
        project_name,
        description,
        price_per_image,
    )

    if label_id:
        return jsonify({"message": "Label submitted", "label_id": label_id}), 201
    return jsonify({"error": "Failed to submit label"}), 500