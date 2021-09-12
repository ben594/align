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
        if output:
            return engn.execute(sqlstr).fetchall()[0]
        else:
            engn.execute(sqlstr)

    # EXAMPLE QUERY
    def get_first_userid(self, username):
        output = self.execute(f"SELECT id FROM users WHERE username={username}")
        return output[0]

    # EXAMPLE TRANSACTION
    def example_transaction(self, )
        pass