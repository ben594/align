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
            SELECT id, name, image_type, image
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
    def get_top_labelers():
        labelers = app.db.execute(
            """
            SELECT u.firstname, u.lastname, COUNT(*) AS labeled_count
            FROM Images i
            JOIN Users u ON i.labeler_uid = u.user_id
            WHERE i.labeled_status = TRUE
            GROUP BY u.firstname, u.lastname
            ORDER BY labeled_count DESC
            LIMIT 3
            """
        )
        if labelers:
            # Process the rows and return them as a list of dictionaries
            return [{"name": f"{row[0]} {row[1]}", "labeled_count": row[2]} for row in labelers]
        else: return none