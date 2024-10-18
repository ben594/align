from flask_login import UserMixin
from flask import current_app as app
from werkzeug.security import generate_password_hash, check_password_hash

from .. import login


class User(UserMixin):
    def __init__(self, user_id, email, firstname, lastname):
        self.user_id = user_id
        self.email = email
        self.firstname = firstname
        self.lastname = lastname

    @staticmethod
    def get_by_auth(email, password):
        rows = app.db.execute(
            """
            SELECT password, user_id, email, firstname, lastname
            FROM Users
            WHERE email = :email
            """,
            email=email,
        )
        if not rows:  # email not found
            return None
        elif not check_password_hash(rows[0][0], password):
            # incorrect password
            return None
        else:
            return User(*(rows[0][1:]))

    @staticmethod
    def email_exists(email):
        rows = app.db.execute(
            """
            SELECT email
            FROM Users
            WHERE email = :email
            """,
            email=email,
        )
        return len(rows) > 0

    @staticmethod
    def register(email, password, firstname, lastname):
        try:
            rows = app.db.execute(
                """
                INSERT INTO Users(email, password, firstname, lastname)
                VALUES(:email, :password, :firstname, :lastname)
                RETURNING user_id
                """,
                email=email,
                password=generate_password_hash(password),
                firstname=firstname,
                lastname=lastname,
            )
            id = rows[0][0]
            return User.get(id)
        except Exception as e:
            # likely email already in use; better error checking and reporting needed;
            # the following simply prints the error to the console:
            print(str(e))
            return None

    @staticmethod
    @login.user_loader
    def get(id):
        rows = app.db.execute(
            """
            SELECT user_id, email, firstname, lastname
            FROM Users
            WHERE user_id = :id
            """,
            id=id,
        )
        return User(*(rows[0])) if rows else None

    @staticmethod
    def get_accepted_label_count(uid):
        result = app.db.execute(
            """
            SELECT COUNT(*) 
            FROM Images 
            WHERE labeler_uid = :uid 
            AND accepted_status = TRUE
            """,
            uid=uid,
        )
        return result[0][0] if result else None

    @staticmethod
    def get_user_name(user_id):
        name = app.db.execute(
            """
            SELECT firstname, lastname
            FROM Users
            WHERE user_id = :user_id
            """,
            user_id=user_id,
        )
        if name:
            return f"{name[0][0]} {name[0][1]}"
        else:
            return None
