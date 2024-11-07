from flask import current_app as app


class Project:
    def __init__(
        self,
        vendor_uid,
        project_id,
        project_name,
        description,
        price_per_image,
    ):
        self.vendor_uid = vendor_uid
        self.project_id = project_id
        self.project_name = project_name
        self.description = description
        self.price_per_image = price_per_image

    @staticmethod
    def is_owner(user_id, project_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Projects
            WHERE vendor_uid = :user_id
            AND project_id = :project_id
            """,
            user_id=user_id,
            project_id=project_id,
        )
        return True if rows else False

    @staticmethod
    def get(project_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Projects
            WHERE project_id = :project_id
            """,
            project_id=project_id,
        )
        return Project(*(rows[0])) if rows else None

    @staticmethod
    def create(
        vendor_uid,
        project_name,
        description,
        price_per_image,
        tags_list,
    ):
        project_id = app.db.execute(
            """
            INSERT INTO Projects (vendor_uid,
            project_name,
            description,
            price_per_image)
            VALUES (:vendor_uid, :project_name, :description, :price_per_image)
            RETURNING project_id
            """,
            vendor_uid=vendor_uid,
            project_name=project_name,
            description=description,
            price_per_image=price_per_image,
        )

        for tag in tags_list:
            app.db.execute(
                """
                INSERT INTO Tags (tag_name)
                VALUES (:tag)
                ON CONFLICT (tag_name) DO NOTHING
                """,
                tag=tag
            )
            
            app.db.execute(
                """
                INSERT INTO ProjectTags (project_id, tag_name)
                VALUES (:project_id, :tag)
                ON CONFLICT DO NOTHING
                """,
                project_id=project_id[0][0],
                tag=tag
            )
        
        return project_id[0][0] if project_id else None

    @staticmethod
    def get_vendor_projects(user_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Projects
            WHERE vendor_uid = :user_id
            """,
            user_id=user_id,
        )
        return [Project(*row) for row in rows] if rows else []

    @staticmethod
    def get_all_tags(project_id): # Move to a separate tag model for modularity
        tags = app.db.execute(
            """
            SELECT t.tag_name
            FROM ProjectTags pt
            JOIN Tags t ON pt.tag_name = t.tag_name
            WHERE pt.project_id = :project_id; 
            """,
            project_id=project_id
        )
        return [row[0] for row in tags] if tags else []

    @staticmethod
    def get_all_image_urls(project_id):
        print("in model")
        image_urls = app.db.execute(
            """
            SELECT * 
            FROM Images
            """,
            # note to self is it an issue that i'm selecting from images but in project controller
            # """
            # SELECT image_url
            # FROM Images
            # WHERE project_id = :project_id
            # """,
            # project_id=project_id,
        )
        print(project_id)
        print("image urls incoming")
        print(image_urls)
        return [url[0] for url in image_urls] if image_urls else []

    @staticmethod
    def get_projects_by_role(user_id, role):
        rows = app.db.execute(
            """
            SELECT p.vendor_uid,
            p.project_id,
            p.project_name,
            p.description,
            p.price_per_image
            FROM Projects p
            JOIN Roles r
            ON p.project_id = r.project_id
            WHERE r.user_id = :user_id
            AND r.role_name = :role
            """,
            user_id=user_id,
            role=role,
        )
        return [Project(*row) for row in rows] if rows else []
    
    @staticmethod
    def get_project_ppi(project_id):
        price = app.db.execute(
            """
            SELECT price_per_image
            FROM Projects
            WHERE project_id = :project_id
            """,
            project_id = project_id
        )
        return price[0][0] if price else None

    @staticmethod
    def get_all_projects():
        rows = app.db.execute(
            """
            SELECT *
            FROM Projects p
            """
        )
        return [Project(*row) for row in rows] if rows else []
