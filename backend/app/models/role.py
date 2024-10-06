from flask import current_app as app


class Role:
    def __init__(self, user_id, project_id, role_name):
        self.user_id = user_id
        self.project_id = project_id
        self.role_name = role_name
