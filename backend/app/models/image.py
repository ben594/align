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
<<<<<<< HEAD

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
=======
    
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
            # Process the rows and return them as a list of dictionaries
            return [{"name": f"{row[0]} {row[1]}", "labeled_count": row[2], "accepted_rate": row[3]} for row in labelers]
        else: return none
    
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
            # Process the rows and return them as a list of dictionaries
            return [{"name": row[0], "unique_contributers": row[1], "progress": row[2]} for row in projects]
        else: return none
>>>>>>> 5221faf2d23536a54caf7f3b7e773102d515685b
