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

    # EXAMPLE QUERY
    def get_userid(self, username):
        output = self.execute(f"SELECT id FROM users WHERE username={username}")
        return output[0]

    # EXAMPLE TRANSACTION
    def example_transaction(self, username):
        """This is not a functioning transaction, but is just meant to explain how to create your own."""
        with self.engine.connect() as conn:
            with conn.begin() as transaction:
                # here, submit all the queries to be part of the transaction
                # if any of these fail, rollbacks will happen to undo any changes
                first_usr = get_userid(username)  # your query should be handled by another function
