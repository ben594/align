from flask import current_app as app


class Image:
    def __init__(self, id, name, image_type, image):
        self.id = id
        self.name = name
        self.image_type = image_type
        self.image = image

    @staticmethod
    def get(id):
        rows = app.db.execute(
            """
SELECT id, name, image_type, image
FROM Images
WHERE id = :id
""",
            id=id,
        )
        return Image(*(rows[0])) if rows else None
