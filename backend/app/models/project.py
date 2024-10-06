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
