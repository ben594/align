from flask import current_app as app


class Image:
    def __init__(
        self,
        image_id,
        image_url,
        project_id,
        labeled_status,
        accepted_status,
        labeler_uid,
        label_text,
    ):
        self.image_id = image_id
        self.image_url = image_url
        self.project_id = project_id
        self.labeled_status = labeled_status
        self.accepted_status = accepted_status
        self.labeler_uid = labeler_uid
        self.label_text = label_text

    @staticmethod
    def get(image_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Images
            WHERE image_id = :image_id
            """,
            image_id=image_id,
        )
        return Image(*(rows[0])) if rows else None

    @staticmethod
    def upload(
        image_url,
        project_id,
    ):
        app.db.execute(
            """
            INSERT INTO Images (image_url, project_id, labeled_status, accepted_status, labeler_uid, label_text)
            VALUES (:image_url, :project_id, FALSE, FALSE, NULL, NULL)
            """,
            image_url=image_url,
            project_id=project_id,
        )

    @staticmethod
    def get_all_images_per_project(project_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Images
            WHERE project_id = :project_id
            """,
            project_id=project_id,
        )
        return [Image(*row) for row in rows] if rows else []

    @staticmethod
    def get_next_image(project_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Images
            WHERE project_id = :project_id
            AND labeled_status = FALSE
            AND accepted_status = FALSE
            LIMIT 1
            """,
            project_id=project_id,
        )

        return Image(*(rows[0])) if rows else None

    @staticmethod
    def get_top_labelers():
        labelers = app.db.execute(
            """
            SELECT 
                u.firstname, 
                u.lastname, 
                COUNT(*) AS labeled_count, 
                ROUND(COUNT(CASE WHEN i.accepted_status = TRUE THEN 1 END) * 1.0 / COUNT(*) * 100, 2) AS accepted_rate
            FROM 
                Images i
            JOIN 
                Users u ON i.labeler_uid = u.user_id
            WHERE 
                i.labeled_status = TRUE
            GROUP BY 
                u.firstname, u.lastname
            ORDER BY 
                labeled_count DESC
            LIMIT 3;
            """
        )
        if labelers:
            return [
                {
                    "name": f"{row[0]} {row[1]}",
                    "labeled_count": row[2],
                    "accepted_rate": row[3],
                }
                for row in labelers
            ]
        else:
            return None

    @staticmethod
    def get_top_projects():
        projects = app.db.execute(
            """
            SELECT p.project_name, 
                COUNT(DISTINCT i.labeler_uid) AS unique_contributors,
                ROUND(COUNT(CASE WHEN i.labeled_status THEN 1 END) * 100.0 / COUNT(i.image_url), 2) AS labeled_percentage
            FROM 
                Projects p
            JOIN 
                Images i ON p.project_id = i.project_id
            GROUP BY 
                p.project_id, p.project_name
            ORDER BY 
                COUNT(DISTINCT i.labeler_uid) DESC
            LIMIT 3
            """
            # TODO: fix this sql query bc idt it's returning the right number for progress rn
        )
        if projects:
            return [
                {"name": row[0], "unique_contributers": row[1], "progress": row[2]}
                for row in projects
            ]
        else:
            return None
