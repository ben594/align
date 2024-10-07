from flask import current_app as app


class Project:
    def __init__(self, id, name, deadline):
        self.id = id
        self.name = name
        self.deadline = deadline

    @staticmethod
    def get(id):
        rows = app.db.execute(
            """
            SELECT id, name, deadline
            FROM Projects
            WHERE id = :id
            """,
            id=id,
        )
        return Project(*(rows[0])) if rows else None

    @staticmethod
    def create(name, deadline):
        inserted_row = app.db.execute(
            """
            INSERT INTO Projects (name, deadline)
            VALUES (:name, :deadline)
            RETURNING id
            """,
            name=name,
            deadline=deadline,
        )
        return inserted_row[0] if inserted_row else None
