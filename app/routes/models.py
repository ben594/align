from datetime import datetime
from app.routes import db, login
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import datetime


class User(UserMixin, db.Model):
    """Class for user table. Includes necessary functions for authentication. 
    Do not remove anything. Feel free to add more."""
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(255), index=True)
    lastname = db.Column(db.String(255), index=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Products(db.Model):
    __tablename__ = 'products'
    pid = db.Column(db.Integer, primary_key=True)
    productname = db.Column(db.String(255), index=True, unique=True)
    price = db.Column(db.Integer)


class Purchases(db.Model):
    __tablename__ = 'purchases'
    order_nr = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer. index=True)
    time_purchased = db.Column(db.DateTime, default=datetime.datetime.utcnow)


@login.user_loader
def load_user(id):
    return User.query.get(int(id))
