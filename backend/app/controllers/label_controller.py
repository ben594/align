from flask import Blueprint, jsonify, redirect, url_for, request, make_response
from flask_login import logout_user
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..models.label import Label

label_bp = Blueprint("label", __name__)


@label_bp.route("/label", methods=["POST"])
@jwt_required()
def submit_label():
    labeler_uid = get_jwt_identity()
    projectID = request.form.get("projectID")
    imageURL = request.form.get("imageURL")
    label = request.form.get("label")

    if not labeler_uid or not projectID or not imageURL or not label:
        return jsonify({"error": "Invalid image label parameters"}), 400

    # connect to models
    label_id = Label.create(
        labeler_uid,
        projectID,
        imageURL,
        label,
    )

    if label_id:
        return jsonify({"message": "Label submitted", "label_id": label_id}), 201
    return jsonify({"error": "Failed to submit label"}), 500

@label_bp.route("/approve_label", methods=["POST"])
@jwt_required()
def approve_label():
    imageURL = request.form.get("imageURL")
    approve_label = Label.approve_label(imageURL)
    if approve_label:
        return jsonify({"message": "Label approved"}), 201
    return jsonify({"error": "Failed to approve label"}), 500

@label_bp.route("/pay_labeler/<int:labeler_uid>/<ppi>", methods=["POST"])
@jwt_required()
def pay_labeler(labeler_uid, ppi):
    pay_labeler = Label.pay_labeler(labeler_uid, ppi)
    if pay_labeler:
        return jsonify({"message": "Labeler paid"}), 201
    return jsonify({"error": "Failed to pay labeler"}), 500

@label_bp.route("/reject_label", methods=["POST"])
@jwt_required()
def reject_label():
    imageURL = request.form.get("imageURL")
    reject_label = Label.reject_label(imageURL)
    if reject_label:
        return jsonify({"message": "Label rejected"}), 201
    return jsonify({"error": "Failed to reject label and update image label history"}), 500

@label_bp.route("/update_finalize_label", methods=["POST"])
@jwt_required()
def update_finalize_label():
    project_id = request.form.get("projectID")
    image_url = request.form.get("imageURL")
    new_label = request.form.get("newLabel")
    finalize_label = Label.update_finalize_label(project_id, image_url, new_label)
    if finalize_label:
        return jsonify({"message": "Label finalized"}), 201
    return jsonify({"error": "Failed to finalize label"}), 500
