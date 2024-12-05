import os
from flask import current_app as app
from sqlalchemy import text

# Project class handles SQL queries for creating, updating, and archiving projects
# Also gets project information

class Project:
    def __init__(
        self,
        vendor_uid,
        project_id,
        project_name,
        description,
        price_per_image,
        is_archived=False,
    ):
        self.vendor_uid = vendor_uid
        self.project_id = project_id
        self.project_name = project_name
        self.description = description
        self.price_per_image = price_per_image
        self.is_archived = is_archived

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
    def get_project_vendor_uid(project_id):
        rows = app.db.execute(
            """
            SELECT vendor_uid
            FROM Projects
            WHERE project_id = :project_id
            """,
            project_id=project_id,
        )
        return rows[0][0] if rows else None

    @staticmethod
    def create(
        vendor_uid,
        project_name,
        description,
        price_per_image,
        tags_list,
    ):
        try:
            # begin transaction
            with app.db.engine.begin() as conn:
                # create project record
                project_id = conn.execute(
                    statement=text(
                        """                
                        INSERT INTO Projects (vendor_uid,
                        project_name,
                        description,
                        price_per_image)
                        VALUES (:vendor_uid, :project_name, :description, :price_per_image)
                        RETURNING project_id;
                        """
                    ),
                    parameters=dict(
                        vendor_uid=vendor_uid,
                        project_name=project_name,
                        description=description,
                        price_per_image=price_per_image,
                    ),
                ).scalar()

                # create tag records for the project
                for tag in tags_list:
                    conn.execute(
                        statement=text(
                            """
                        INSERT INTO Tags (tag_name)
                        VALUES (:tag)
                        ON CONFLICT (tag_name) DO NOTHING
                        """
                        ),
                        parameters=dict(
                            tag=tag,
                        ),
                    )

                    conn.execute(
                        statement=text(
                            """
                            INSERT INTO ProjectTags (project_id, tag_name)
                            VALUES (:project_id, :tag)
                            ON CONFLICT DO NOTHING
                            """
                        ),
                        parameters=dict(
                            project_id=project_id,
                            tag=tag,
                        ),
                    )

                # get user balance
                amount = float(os.getenv("PROJECT_COST") or 25)
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
                if user_balance < amount:
                    raise Exception(
                        f"User balance {user_balance} not enough to create project, rolling back transaction"
                    )

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

                # create project owner role
                conn.execute(
                    statement=text(
                        """
                        INSERT INTO Roles (user_id, project_id, role_name)
                        VALUES (:user_id, :project_id, :role_name)
                        """
                    ),
                    parameters=dict(
                        user_id=vendor_uid,
                        project_id=project_id,
                        role_name="owner",
                    ),
                )

                return project_id if project_id else None
        except Exception as e:
            print(e)
            return None

        return project_id[0][0] if project_id else None

    @staticmethod
    def add_tags(tags_list, project_id):
        for tag in tags_list:
            app.db.execute(
                """
                INSERT INTO Tags (tag_name)
                VALUES (:tag)
                ON CONFLICT (tag_name) DO NOTHING
                """,
                tag=tag,
            )

            app.db.execute(
                """
                INSERT INTO ProjectTags (project_id, tag_name)
                VALUES (:project_id, :tag)
                ON CONFLICT DO NOTHING
                """,
                project_id=project_id,
                tag=tag,
            )

    @staticmethod
    def remove_all_tags(project_id):
        result = app.db.execute(
            """
            DELETE FROM ProjectTags
            WHERE project_id = :project_id
            """,
            project_id=project_id,
        )
        return bool(result)

    @staticmethod
    def update(
        project_id,
        project_name=None,
        description=None,
        price_per_image=None,
        tags_list=None,
    ):
        updates = []
        params = {"project_id": project_id}

        if project_name is not None:
            updates.append("project_name = :project_name")
            params["project_name"] = project_name
        if description is not None:
            updates.append("description = :description")
            params["description"] = description
        if price_per_image is not None:
            updates.append("price_per_image = :price_per_image")
            params["price_per_image"] = price_per_image
        if tags_list is not None:
            Project.remove_all_tags(project_id)
            Project.add_tags(tags_list, project_id)

        if not updates:
            return False

        update_query = f"""
            UPDATE Projects
            SET {', '.join(updates)}
            WHERE project_id = :project_id
        """

        result = app.db.execute(update_query, **params)
        return bool(result)

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
    def get_all_tags(project_id):  # Move to a separate tag model for modularity
        tags = app.db.execute(
            """
            SELECT t.tag_name
            FROM ProjectTags pt
            JOIN Tags t ON pt.tag_name = t.tag_name
            WHERE pt.project_id = :project_id; 
            """,
            project_id=project_id,
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
            p.price_per_image,
            p.is_archived
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
            project_id=project_id,
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

    @staticmethod
    def get_project_members(project_id):
        rows = app.db.execute(
            """
            SELECT U.user_id, U.firstname, U.lastname, U.email, R.role_name
            FROM Users U
            JOIN Roles R ON U.user_id = R.user_id
            WHERE R.project_id = :project_id
            """,
            project_id=project_id,
        )
        return [
            {
                "id": row[0],
                "name": f"{row[1]} {row[2]}",
                "email": row[3],
                "role": row[4],
            }
            for row in rows
        ] if rows else []

    @staticmethod
    def archive_project(project_id):
        result = app.db.execute(
            """
            UPDATE Projects
            SET is_archived = TRUE
            WHERE project_id = :project_id
            """,
            project_id=project_id,
        )
        return bool(result)
import os
from flask import current_app as app
from sqlalchemy import text


class Project:
    def __init__(
        self,
        vendor_uid,
        project_id,
        project_name,
        description,
        price_per_image,
        is_archived=False,
    ):
        self.vendor_uid = vendor_uid
        self.project_id = project_id
        self.project_name = project_name
        self.description = description
        self.price_per_image = price_per_image
        self.is_archived = is_archived

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
    def get_project_vendor_uid(project_id):
        rows = app.db.execute(
            """
            SELECT vendor_uid
            FROM Projects
            WHERE project_id = :project_id
            """,
            project_id=project_id,
        )
        return rows[0][0] if rows else None

    @staticmethod
    def create(
        vendor_uid,
        project_name,
        description,
        price_per_image,
        tags_list,
    ):
        # begin transaction
        with app.db.engine.begin() as conn:
            # create project record
            project_id = conn.execute(
                statement=text(
                    """                
                    INSERT INTO Projects (vendor_uid,
                    project_name,
                    description,
                    price_per_image)
                    VALUES (:vendor_uid, :project_name, :description, :price_per_image)
                    RETURNING project_id;
                    """
                ),
                parameters=dict(
                    vendor_uid=vendor_uid,
                    project_name=project_name,
                    description=description,
                    price_per_image=price_per_image,
                ),
            ).scalar()

            # create tag records for the project
            for tag in tags_list:
                conn.execute(
                    statement=text(
                        """
                    INSERT INTO Tags (tag_name)
                    VALUES (:tag)
                    ON CONFLICT (tag_name) DO NOTHING
                    """
                    ),
                    parameters=dict(
                        tag=tag,
                    ),
                )

                conn.execute(
                    statement=text(
                        """
                        INSERT INTO ProjectTags (project_id, tag_name)
                        VALUES (:project_id, :tag)
                        ON CONFLICT DO NOTHING
                        """
                    ),
                    parameters=dict(
                        project_id=project_id,
                        tag=tag,
                    ),
                )

            # get user balance
            amount = float(os.getenv("PROJECT_COST", 25))
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
            if user_balance < amount:
                raise Exception(
                    f"Failed to create project, you do not have enough money."
                )

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

            # create project owner role
            conn.execute(
                statement=text(
                    """
                    INSERT INTO Roles (user_id, project_id, role_name)
                    VALUES (:user_id, :project_id, :role_name)
                    """
                ),
                parameters=dict(
                    user_id=vendor_uid,
                    project_id=project_id,
                    role_name="owner",
                ),
            )

            return project_id if project_id else None
        return project_id[0][0] if project_id else None

    @staticmethod
    def add_tags(tags_list, project_id):
        for tag in tags_list:
            app.db.execute(
                """
                INSERT INTO Tags (tag_name)
                VALUES (:tag)
                ON CONFLICT (tag_name) DO NOTHING
                """,
                tag=tag,
            )

            app.db.execute(
                """
                INSERT INTO ProjectTags (project_id, tag_name)
                VALUES (:project_id, :tag)
                ON CONFLICT DO NOTHING
                """,
                project_id=project_id,
                tag=tag,
            )

    @staticmethod
    def remove_all_tags(project_id):
        result = app.db.execute(
            """
            DELETE FROM ProjectTags
            WHERE project_id = :project_id
            """,
            project_id=project_id,
        )
        return bool(result)

    @staticmethod
    def update(
        project_id,
        project_name=None,
        description=None,
        price_per_image=None,
        tags_list=None,
    ):
        updates = []
        params = {"project_id": project_id}

        if project_name is not None:
            updates.append("project_name = :project_name")
            params["project_name"] = project_name
        if description is not None:
            updates.append("description = :description")
            params["description"] = description
        if price_per_image is not None:
            updates.append("price_per_image = :price_per_image")
            params["price_per_image"] = price_per_image
        if tags_list is not None:
            Project.remove_all_tags(project_id)
            Project.add_tags(tags_list, project_id)

        if not updates:
            return False

        update_query = f"""
            UPDATE Projects
            SET {', '.join(updates)}
            WHERE project_id = :project_id
        """

        result = app.db.execute(update_query, **params)
        return bool(result)

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
    def get_all_tags(project_id):  # Move to a separate tag model for modularity
        tags = app.db.execute(
            """
            SELECT t.tag_name
            FROM ProjectTags pt
            JOIN Tags t ON pt.tag_name = t.tag_name
            WHERE pt.project_id = :project_id; 
            """,
            project_id=project_id,
        )
        return [row[0] for row in tags] if tags else []
    
    @staticmethod
    def get_project_metrics(project_id): 
        rows = app.db.execute(
           """
            SELECT 
            ROUND(100.0 * SUM(CASE WHEN labeled_status = TRUE THEN 1 ELSE 0 END) / COUNT(*), 2) AS percent_labeled,
            ROUND(100.0 * SUM(CASE WHEN accepted_status = TRUE THEN 1 ELSE 0 END) / COUNT(*), 2) AS percent_approved
            FROM Images
            WHERE Images.project_id = :project_id
            GROUP BY Images.project_id; 
            """,
            project_id=project_id
        )
        return [
        {
            "percent_labeled": float(row[0]),
            "percent_approved": float(row[1])
        }
        for row in rows
        ] if rows else []
    

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
            p.price_per_image,
            p.is_archived
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
            project_id=project_id,
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

    @staticmethod
    def get_project_members(project_id):
        rows = app.db.execute(
            """
            SELECT U.user_id, U.firstname, U.lastname, U.email, R.role_name
            FROM Users U
            JOIN Roles R ON U.user_id = R.user_id
            WHERE R.project_id = :project_id
            """,
            project_id=project_id,
        )
        return [
            {
                "id": row[0],
                "name": f"{row[1]} {row[2]}",
                "email": row[3],
                "role": row[4],
            }
            for row in rows
        ] if rows else []

    @staticmethod
    def archive_project(project_id):
        result = app.db.execute(
            """
            UPDATE Projects
            SET is_archived = TRUE
            WHERE project_id = :project_id
            """,
            project_id=project_id,
        )
        return bool(result)