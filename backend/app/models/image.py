from flask import current_app as app
from sqlalchemy import text

from .project import Project
import os


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
        # run transaction to insert image and deduct balance from vendor
        with app.db.engine.begin() as conn:
            # insert image record
            conn.execute(
                statement=text(
                    """
                    INSERT INTO Images (image_url, project_id, labeled_status, accepted_status, labeler_uid, label_text)
                    VALUES (:image_url, :project_id, FALSE, FALSE, NULL, NULL)
                    """
                ),
                parameters=dict(
                    image_url=image_url,
                    project_id=project_id,
                ),
            )

            # deduct from balance
            vendor_uid = Project.get_project_vendor_uid(project_id)

            # get user balance
            user_balance = conn.execute(
                statement=text(
                    """
                    SELECT balance
                    FROM Users
                    WHERE user_id = :user_id;
                    """
                ),
                parameters=dict(
                    user_id=vendor_uid,
                ),
            ).scalar()

            # stop transaction if user does not have enough money
            amount = Project.get_project_ppi(project_id)
            if user_balance < amount:
                raise Exception(
                    "User balance not enough to create project, rolling back transaction"
                )

            # if amount is 0 then shouldn't do anything
            if amount > 0:
                # subtract balance from account within transaction
                conn.execute(
                    statement=text(
                        """
                        UPDATE Users
                        SET balance = balance - :amount
                        WHERE user_id = :user_id;
                        """
                    ),
                    parameters=dict(
                        user_id=vendor_uid,
                        amount=amount,
                    ),
                )

                # create new payment record
                balance_change = -1 * amount
                conn.execute(
                    statement=text(
                        """
                        INSERT INTO Payments(user_id, transaction_time, balance_change)
                        VALUES(:user_id, NOW(), :balance_change);
                        """
                    ),
                    parameters=dict(
                        user_id=vendor_uid,
                        balance_change=balance_change,
                    ),
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
    def get_all_finalized_images(project_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Images
            WHERE project_id = :project_id
            AND labeled_status = TRUE
            AND accepted_status = TRUE
            """,
            project_id=project_id,
        )
        return [Image(*row) for row in rows] if rows else []

    @staticmethod
    def get_project_metrics(project_id):
        metrics = app.db.execute(
            """
        SELECT
            (SUM(CASE WHEN labeled_status AND accepted_status THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100 AS percentage
        FROM Images
        WHERE project_id = :project_id
        """,
            project_id=project_id,
        )
        print(metrics)
        return metrics[0][0] if result else None

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

    # TODO: edit the query so you can only get images where you didn't write the label
    @staticmethod
    def get_next_image_review(project_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Images
            WHERE project_id = :project_id
            AND labeled_status = TRUE
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
    def get_user_labels(user_id):
        rows = app.db.execute(
            """
            SELECT Images.project_id AS project_id, 
            Images.label_text AS label_text,
            Images.accepted_status AS accepted_status,
            Projects.project_name AS project_name
            FROM Images, Projects
            WHERE Images.labeler_uid = :user_id
            AND Images.project_id = Projects.project_id
            """,
            user_id=user_id,
        )
        print("ROWS", rows)

        return (
            [
                {
                    "project_id": row[0],
                    "label_text": row[1],
                    "accepted_status": row[2],
                    "project_name": row[3],
                }
                for row in rows
            ]
            if rows
            else []
        )

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
