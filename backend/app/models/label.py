from flask import current_app as app


class Label:
    def __init__(self, user_id, image_id, response):
        self.user_id = user_id
        self.image_id = image_id
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

    @staticmethod
    def get_by_image(image_id):
        rows = app.db.execute(
            """
            SELECT user_id, image_id, response
            FROM Labels
            WHERE image_id = :image_id
            """,
            image_id=image_id,
        )
        # TODO return list
        return Label(*(rows[0])) if rows else None
    
    @staticmethod
    def get_by_user(user_id):
        rows = app.db.execute(
            """
            SELECT user_id, image_id, response
            FROM Labels
            WHERE user_id = :user_id
            """,
            user_id=user_id,
        )
        # TODO return list
        return Label(*(rows[0])) if rows else None
