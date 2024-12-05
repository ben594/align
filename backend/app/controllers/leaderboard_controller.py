from flask import Blueprint, jsonify, redirect, url_for, request
from flask_login import logout_user

from ..models.image import Image

# Controller for everything related to the leaderboard
bp = Blueprint("leaderboard", __name__)

# Returns top 3 labelers based on accepted label rate
@bp.route("/labeler_leaderboard", methods=["GET"])
def get_top_labelers():
    labelers = Image.get_top_labelers()
    if labelers is None:
        return jsonify([]), 400
    return jsonify(labelers), 200

# Returns top 3 projects based on project completion
@bp.route("/project_leaderboard", methods=["GET"])
def get_top_projects():
    projects = Image.get_top_projects()
    if projects is None:
        return jsonify([]), 400
    return jsonify(projects), 200
