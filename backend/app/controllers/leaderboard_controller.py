from flask import Blueprint, jsonify, redirect, url_for, request
from flask_login import logout_user

from ..models.image import Image

bp = Blueprint("leaderboard", __name__)


@bp.route("/labeler_leaderboard", methods=["GET"])
def get_top_labelers():
    labelers = Image.get_top_labelers()
    if labelers is None:
        return jsonify([]), 400
    return jsonify(labelers), 200

@bp.route("/project_leaderboard", methods=["GET"])
def get_top_projects():
    projects = Image.get_top_projects()
    if projects is None:
        return jsonify([]), 400
    return jsonify(projects), 200
