from flask import current_app as app


class Role:
    def __init__(self, user_id, project_id, role_name):
        self.user_id = user_id
        self.project_id = project_id
        self.role_name = role_name

    @staticmethod
    def create(user_id, project_id, role_name):
        app.db.execute(
            """
            INSERT INTO Roles (user_id, project_id, role_name)
            VALUES (:user_id, :project_id, :role_name)
            """,
            user_id=user_id,
            project_id=project_id,
            role_name=role_name,
        )
        return

    @staticmethod
    def get(user_id, project_id):
        rows = app.db.execute(
            """
            SELECT user_id, project_id, role_name
            FROM Roles
            WHERE user_id = :user_id
            AND project_id = :project_id
            """,
            user_id=user_id,
            project_id=project_id,
        )
        return Role(*(rows[0])) if rows else None

    @staticmethod
    def update(user_id, project_id, role_name):
        result = app.db.execute(
            """
            UPDATE Roles
            SET role_name = :role_name
            WHERE user_id = :user_id
            AND project_id = :project_id
            """,
            user_id=user_id,
            project_id=project_id,
            role_name=role_name,
        )
        return bool(result)

    def delete(user_id, project_id):
        result = app.db.execute(
            """
            DELETE FROM Roles
            WHERE user_id = :user_id
            AND project_id = :project_id
            """,
            user_id=user_id,
            project_id=project_id,
        )
        return bool(result)
