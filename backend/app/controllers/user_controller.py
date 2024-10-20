from flask import Blueprint, jsonify, redirect, url_for, request, make_response
from flask_login import logout_user
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies

from ..models.user import User

bp = Blueprint("users", __name__)


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.get_by_auth(email, password)
    if user is None:
        return jsonify({"error": "Failed to login"}), 400

    access_token = create_access_token(identity=user.user_id, expires_delta=False)
    return jsonify(access_token=access_token), 200


@bp.route("/signup", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    if User.email_exists(email):
        return jsonify({"error": "Account with email already exists."}), 400

    user_id = User.register(email, password, firstname, lastname)
    access_token = create_access_token(identity=user_id, expires_delta=False)
    return jsonify(access_token=access_token, user_id=user_id), 200


@bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    logout_user()
    return jsonify({"message": "User logged out successfully"}), 200


# TODO @Jamie: update function & route to take in id & authentication
@bp.route("/profile/<int:user_id>/stats", methods=["GET"])
# @jwt_required()
def get_user_stats(user_id):
    uid = request.args.get(user_id)
    num_accepted_labels = User.get_accepted_label_count(uid)
    return jsonify(num_accepted_labels), 200

# TODO @Jamie: update function & route to take in id & authentication
@bp.route("/profile/<int:user_id>/user_name", methods=["GET"])
# @jwt_required()
def get_user_name(user_id):
    uid = request.args.get(user_id)
    user_name = User.get_user_name(user_id)
    return jsonify(user_name), 200
