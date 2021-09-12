import passwords # separate file not tracked by git

SQLALCHEMY_DATABASE_URI = 'postgresql://{}:{}@localhost/{}'\
    .format(passwords.USER,
            passwords.DATABASE_PASSWORD,
            passwords.DATABASE)
