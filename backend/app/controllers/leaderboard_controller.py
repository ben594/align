from flask import Blueprint, jsonify, redirect, url_for, request
from flask_login import logout_user

from ..models.image import Image

bp = Blueprint("leaderboard", __name__)


@bp.route("/leaderboard", methods=["GET"])
def get_top_labelers():
    labelers = Image.get_top_labelers()
    if labelers is None:
        return jsonify({"error": "Failed to fetch top labelers"}), 400
    return jsonify(labelers), 200
