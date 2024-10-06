from flask import current_app as app


class Label:
    def __init__(self, user_id, image_id, response):
        self.user_id = user_id
        self.project_id = image_id
        self.response = response
