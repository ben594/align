from flask import current_app as app


class Cart:
    """
    This is just a TEMPLATE for Cart, you should change this by adding or 
        replacing new columns, etc. for your design.
    """
    def __init__(self, id, uid, pid, time_added_to_cart):
        self.id = id
        self.uid = uid
        self.pid = pid
        self.time_added_to_cart = time_added_to_cart

    @staticmethod
    def get(id):
        rows = app.db.execute('''
SELECT id, uid, pid, time_added_to_cart
FROM Cart
WHERE id = :id
''',
                              id=id)
        return Cart(*(rows[0])) if rows else None

    @staticmethod
    def get_all_by_uid_since(uid, since):
        rows = app.db.execute('''
SELECT id, uid, pid, time_added_to_cart
FROM Cart
WHERE uid = :uid
AND time_added_to_cart >= :since
ORDER BY time_added_to_cart DESC
''',
                              uid=uid,
                              since=since)
        return [Cart(*row) for row in rows]
