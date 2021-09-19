from flask import current_app as app


class Product:
    def __init__(self, id, name, price, available):
        self.id = id
        self.name = name
        self.price = price
        self.available = available

    @staticmethod
    def get(id):
        result = app.db.execute('''
SELECT id, name, price, available
FROM Products
WHERE id = :id
''',
                                id=id)
        row = result.first()
        return Product(*row) if row is not None else None

    @staticmethod
    def get_all(available=True):
        result = app.db.execute('''
SELECT id, name, price, available
FROM Products
WHERE available = :available
''',
                                available=available)
        return [Product(*row) for row in result]
