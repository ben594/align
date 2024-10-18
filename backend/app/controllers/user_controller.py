from flask import Blueprint, jsonify, redirect, url_for, request, make_response
from flask_login import logout_user
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

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

    access_token = create_access_token(identity=user.user_id)
    response = make_response(jsonify({"message": "User logged in"}), 200)
    response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite='None')
    print(f"Cookie set: {response.headers['Set-Cookie']}")

    return response


@bp.route("/signup", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    firstname = data.get("firstname")
    lastname = data.get("lastname")

    if User.email_exists(email):
        return jsonify({"error": "Account with email already exists"}), 400

    user_id = User.register(email, password, firstname, lastname)

    access_token = create_access_token(identity=user_id)
    response = make_response(jsonify({"message": "User signed up"}), 200)
    response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite='None')

    return response


@bp.route("/auth/verify", methods=["GET"])
@jwt_required()
def check_auth():
    user_id = get_jwt_identity()
    if user_id:
        return jsonify({"authenticated": True}), 200
    else:
        return jsonify({"authenticated": False}), 401


@bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index.index"))


@bp.route("/stats", methods=["GET"])
def get_user_stats():
    uid = request.args.get("uid")
    num_accepted_labels = User.get_accepted_label_count(uid)
    return jsonify(num_accepted_labels), 200


@bp.route("/username", methods=["GET"])
def get_user_name():
    uid = request.args.get("uid")
    user_name = User.get_user_name(uid)
    return jsonify(user_name), 200
