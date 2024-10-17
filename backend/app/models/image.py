from flask import current_app as app


class Image:
    def __init__(self, id, name, image_type, image, project_id):
        self.id = id
        self.name = name
        self.image_type = image_type
        self.image = image
        self.project_id = project_id

    @staticmethod
    def get(id):
        rows = app.db.execute(
            """
            SELECT id, name, image_type, image, project_id
            FROM Images
            WHERE id = :id
            """,
            id=id,
        )
        return Image(*(rows[0])) if rows else None

    @staticmethod
    def upload(name, image_type, image, project_id):
        inserted_row = app.db.execute(
            """
            INSERT INTO Images (name, image_type, image, project_id)
            VALUES (:name, :image_type, :image, :project_id)
            """,
            name=name,
            image_type=image_type,
            image=image,
            project_id=project_id,
        )
        return inserted_row[0] if inserted_row else None

    @staticmethod
    def get_by_project(project_id):
        rows = app.db.execute(
            """
            SELECT id, name, image_type, image, project_id
            FROM Images
            WHERE project_id = :project_id
            """,
            project_id=project_id,
        )

        # TODO return list
        return Image(*(rows[0])) if rows else None
