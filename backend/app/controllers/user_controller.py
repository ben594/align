from flask import Blueprint, jsonify, redirect, url_for, request
from flask_login import logout_user

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
    
    return jsonify({"message": "Registration complete"}), 201

@bp.route("/signup", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    firstname = data.get("firstname")
    lastname = data.get("lastname")

    if User.email_exists(email):
        return jsonify({"error": "Account with email already exists"}), 400

    User.register(email, password, firstname, lastname)
    return jsonify({"message": "Registration complete"}), 201


@bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index.index"))

@bp.route("/stats", methods=['GET'])
def get_user_stats():
    uid = request.args.get('uid')
    num_accepted_labels = User.get_accepted_label_count(uid)
    return jsonify(num_accepted_labels), 200

@bp.route("/username", methods=['GET'])
def get_user_name(): 
    uid = request.args.get('uid')
    user_name = User.get_user_name(uid)
    return jsonify(user_name), 200
