from sqlalchemy import create_engine
from werkzeug.security import generate_password_hash, check_password_hash


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
            return engn.execute(sqlstr).fetchall()  # if the query expects something in return
        else:
            engn.execute(sqlstr)  # if the query has no response (ex: UPDATE)


    # EXAMPLE QUERIES for user authentication
    def register_user(self, email, password, firstname, lastname):
        """Add a user to the users table."""
        try: 
            output = self.execute(f"INSERT INTO users(email, password, firstname, lastname) VALUES \
                                                ('{email}', '{generate_password_hash(password)}', '{firstname}', '{lastname}')")
            return True
        except:
            return False

    def check_user_credentials(self, email, password):
        """Verify user email and password combination."""
        output = self.execute(f"SELECT password FROM users WHERE email='{email}'", return_output=True)
        if not output:
            return False
        return check_password_hash(output[0][0], password)

    def get_user_info_by_email(self, email):
        """Get user info based on email."""
        output = self.execute(f"SELECT id, email, firstname, lastname FROM users WHERE email='{email}'", return_output=True)
        return output[0] if output else output

    def get_user_info_by_id(self, id):
        """Get user info based on user id."""
        output = self.execute(f"SELECT id, email, firstname, lastname FROM users WHERE id='{id}'", return_output=True)
        return output[0] if output else output

    # EXAMPLE QUERIES
    def get_avail_products(self):
        """Returns all product ids for available products."""
        return self.execute("SELECT pid FROM products WHERE available=true;", return_output=True)

    def get_product_details(self, product_id):
        """Returns all rows for a given product by id"""
        return self.execute(f"SELECT * FROM products WHERE pid={product_id};", return_output=True)

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
