import os
import app.passwords # separate file not tracked by git

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = 'postgresql://{}:{}@localhost/{}'\
                                .format(app.passwords.USER,
                                        app.passwords.DATABASE_PASSWORD,
                                        app.passwords.DATABASE)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
