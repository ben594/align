from sqlalchemy import create_engine

class DB:
    """Hosts all functions for querying the database."""
    def __init__(self, app):
        self.engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

    def execute(self, sqlstr, connection=None):
        if connection is None:
            return self.engine.execute(sqlstr)
        else:
            return connection.execute(sqlstr)  # To support transactions
