from sqlalchemy import create_engine

class DB:
    """Hosts all functions for querying the database."""
    def __init__(self, app):
        self.engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

    def execute(self, sqlstr, connection=None, return_output=False):
        """Executes a given SQL query and returns output if specified. 
           Supports transactions (thereby rollbacks) by calling the 
           function continually and passing the same connection in each 
           call.

        Args:
            sqlstr (String): SQL String to be executed
            connection (engine.connect(), optional): Pass a connection 
                here in each SQL query to implement a transaction. Defaults 
                to None.
            return_output (bool, optional): If outputs are needed as a 
                return, specify True here. Defaults to False.
        """
        if connection:  # To support transactions
            engn = connection
        else:
            engn = self.engine
        # Execute the query
        if return_output:
            return engn.execute(sqlstr).fetchall()[0]  # if the query expects something in return
        else:
            engn.execute(sqlstr)  # if the query has no response (ex: UPDATE)

    # EXAMPLE QUERIES
    def get_product_details(self, product_id):
        """Returns all rows for a given product by id"""
        return self.execute(f"SELECT * FROM products WHERE pid={product_id};", return_output=True)

    def get_users_purchases(self, user_id, since):
        """Returns a list of product_ids that the given user has purchased.
        
        Args:
            user_id (int): Integer User id. Has to match what's in the DB
            since (datetime Obj): Sets the limit to how far back to look
        """
        str_date = str(since)
        return self.execute(f"SELECT pid
                              FROM purchases
                              WHERE uid={user_id} 
                                AND time_purchased > {str_date}", return_output=True)  # you can do multiline!

    # EXAMPLE TRANSACTION
    def get_my_purchases(self, product_id):
        """This is not a functioning transaction, it is just meant to explain how to create your own."""
        with self.engine.connect() as conn:
            with conn.begin() as transaction:
                # here, submit all the queries to be part of the transaction
                # if any of these fail, rollbacks will happen to undo any changes
                first_usr = get_product_details(product_id)
