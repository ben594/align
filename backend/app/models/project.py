from flask import current_app as app


class Project:
    def __init__(
        self,
        vendor_uid,
        project_id,
        project_name,
        description,
        price_per_image,
        total_num_images,
        deadline,
    ):
        self.vendor_uid = vendor_uid
        self.project_id = project_id
        self.project_name = project_name
        self.description = description
        self.price_per_image = price_per_image
        self.total_num_images = total_num_images
        self.deadline = deadline

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
        total_num_images,
        deadline,
    ):
        project_id = app.db.execute(
            """
            INSERT INTO Projects (vendor_uid,
            project_name,
            description,
            price_per_image,
            total_num_images,
            deadline)
            VALUES (:vendor_uid, :project_name, :description, :price_per_image, :total_num_images, :deadline)
            RETURNING project_id
            """,
            vendor_uid=vendor_uid,
            project_name=project_name,
            description=description,
            price_per_image=price_per_image,
            total_num_images=total_num_images,
            deadline=deadline,
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
