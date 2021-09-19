from app.routes import login
from flask_login import UserMixin
from flask import current_app as app
from werkzeug.security import generate_password_hash, check_password_hash


class User(UserMixin):
    def __init__(self, id, email, firstname, lastname):
        self.id = id
        self.email = email
        self.firstname = firstname
        self.lastname = lastname

    @staticmethod
    def get_by_auth(email, password):
        result = app.db.execute("""
SELECT password, id, email, firstname, lastname
FROM Users
WHERE email = :email
""",
                                email=email)
        row = result.first()
        if row is None:  # email not found
            return None
        elif not check_password_hash(row[0], password):  # incorrect password
            return False
        else:
            return User(*(row[1:]))

    @staticmethod
    def email_exists(email):
        result = app.db.execute("""
SELECT email
FROM Users
WHERE email = :email
""",
                                email=email)
        return result.first() is not None

    @staticmethod
    def register(email, password, firstname, lastname):
        try:
            result = app.db.execute("""
INSERT INTO Users(email, password, firstname, lastname)
VALUES(:email, :password, :firstname, :lastname)
""",
                                    email=email,
                                    password=generate_password_hash(password),
                                    firstname=firstname,
                                    lastname=lastname)
            id = result.inserted_primary_key[0]
            return User.get(id)
        except Exception:
            # likely email already in use; better error checking and
            # reporting needed
            return None

    @staticmethod
    @login.user_loader
    def get(id):
        result = app.db.execute("""
SELECT id, email, firstname, lastname
FROM Users
WHERE id = :id
""",
                                id=id)
        row = result.first()
        return User(*row) if row is not None else None
