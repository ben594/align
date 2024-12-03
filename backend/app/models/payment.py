from flask import current_app as app


class Payment:
    def __init__(
        self, transaction_id, user_id, sender_id, transaction_time, balance_change
    ):
        self.transaction_id = transaction_id
        self.user_id = user_id
        self.sender_id = sender_id
        self.transaction_time = transaction_time
        self.balance_change = balance_change

    @staticmethod
    def get(transaction_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Payments
            WHERE transaction_id = :transaction_id
            """,
            transaction_id=transaction_id,
        )
        return Payment(*(rows[0])) if rows else None

    @staticmethod
    def get_all_by_uid(user_id):
        rows = app.db.execute(
            """
            SELECT *
            FROM Payments
            WHERE user_id = :user_id
            ORDER BY transaction_time DESC
            """,
            user_id=user_id,
        )
        return [Payment(*row) for row in rows]

    @staticmethod
    def get_all_by_uid_since(user_id, since):
        rows = app.db.execute(
            """
            SELECT *
            FROM Payments
            WHERE user_id = :user_id
            AND transaction_time >= :since
            ORDER BY transaction_time DESC
            """,
            user_id=user_id,
            since=since,
        )
        return [Payment(*row) for row in rows]
