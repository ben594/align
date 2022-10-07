from flask import current_app as app


class Inventory:
    def __init__(self, uid, pid, count):
        self.id = id
        self.uid = uid
        self.pid = pid
        self.count = count

    @staticmethod
    def get_by_pid(id):
        rows = app.db.execute('''
SELECT uid, pid, count
FROM Inventory
WHERE pid = :pid
''',
                              id=id)
        return Inventory(*(rows[0])) if rows else None

    @staticmethod
    def get_by_uid(id):
        rows = app.db.execute('''
SELECT uid, pid, count
FROM Inventory
WHERE uid = :uid
''',
                              id=id)
        return Inventory(*(rows[0])) if rows else None
