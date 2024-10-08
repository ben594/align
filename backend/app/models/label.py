from flask import current_app as app


class Label:
    def __init__(self, user_id, image_id, response):
        self.user_id = user_id
        self.project_id = image_id
        self.response = response

    @staticmethod
    def create(user_id, image_id, response):
        inserted_row = app.db.execute(
            """
            INSERT INTO Labels (user_id, image_id, response)
            VALUES (:user_id, :image_id, :response)
            """,
            user_id=user_id,
            image_id=image_id,
            response=response,
        )
        return inserted_row[0] if inserted_row else None
