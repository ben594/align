from flask import jsonify, render_template, redirect, url_for, flash, request
from werkzeug.urls import url_parse
from flask_login import login_user, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo

from ..models.user import User


from flask import Blueprint

bp = Blueprint("users", __name__)


@bp.route("/login", methods=["GET", "POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.get_by_auth(email, password)
    if user is None:
        return jsonify({"message": "Failed to login"}), 400
    
    return jsonify({"message": "Registration complete"}), 201

@bp.route("/signup", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    firstname = data.get("firstname")
    lastname = data.get("lastname")

    if User.email_exists(email):
        return jsonify({"message": "Account with email already exists"}), 400

    User.register(email, password, firstname, lastname)
    return jsonify({"message": "Registration complete"}), 201


@bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index.index"))
