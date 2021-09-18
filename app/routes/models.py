from app.routes import login
from flask_login import UserMixin
from flask import current_app as app


class User(UserMixin):
    def __init__(self, id, email, firstname, lastname):
        self.id = id
        self.email = email
        self.firstname = firstname
        self.lastname = lastname

    def __repr__(self):
        return '<User {}>'.format(self.firstname)



@login.user_loader
def load_user(id):
    info = app.db.get_user_info_by_id(id)
    if not info:
        return None
    user = User(info[0], info[1], info[2], info[3])
    return user
