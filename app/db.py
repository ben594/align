from sqlalchemy import create_engine, text


class DB:
    """Hosts all functions for querying the database."""
    def __init__(self, app):
        self.engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

    def execute(self, sqlstr, **kwargs):
        """Execute sqlstr and return a sqlalchemy.engine.CursorResult.  sqlstr
        will be wrapped automatically in a
        sqlalchemy.sql.expression.TextClause.  You can use :param
        inside sqlstr and supply its value as a kwarg.  See
        https://docs.sqlalchemy.org/en/14/core/connections.html#sqlalchemy.engine.execute
        https://docs.sqlalchemy.org/en/14/core/sqlelement.html#sqlalchemy.sql.expression.text
        https://docs.sqlalchemy.org/en/14/core/connections.html#sqlalchemy.engine.CursorResult
        for additional details."""
        return self.engine.execute(text(sqlstr), kwargs)

    # EXAMPLE QUERIES for user authentication

    def get_user_info_by_email(self, email):
        """Get user info based on email."""
        output = self.execute(f"SELECT id, email, firstname, lastname FROM users WHERE email='{email}'", return_output=True)
        return output[0] if output else output

    # EXAMPLE QUERIES
    def get_purchase_history(self, user_id, since):
        """Returns a list of product_ids that the given user has purchased.
        
        Args:
            user_id (int): Integer User id. Has to match what's in the DB
            since (datetime Obj): Sets the limit to how far back to look
        """
        str_date = str(since)
        return self.execute(f"SELECT pid \
                              FROM purchases \
                              WHERE uid={user_id} \
                                AND time_purchased > '{str_date}';", return_output=True)  # you can do multiline!

    # EXAMPLE TRANSACTION
    def get_my_purchases(self, product_id):
        """This is not a functioning transaction, it is just meant to explain how to create your own."""
        with self.engine.connect() as conn:
            with conn.begin() as transaction:
                # here, submit all the queries to be part of the transaction
                # if any of these fail, rollbacks will happen to undo any changes
                first_usr = self.get_product_details(product_id)
