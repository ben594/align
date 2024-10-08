from flask import Flask
from flask_login import LoginManager
from .config import Config
from .db import DB


login = LoginManager()
login.login_view = 'users.login'


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.db = DB(app)
    login.init_app(app)

    from .controllers.index import bp as index_bp
    app.register_blueprint(index_bp)

    from .controllers.user_controller import bp as user_bp
    app.register_blueprint(user_bp)
    
    from .controllers.project_controller import project_bp
    app.register_blueprint(project_bp)
    
    from .controllers.label_controller import label_bp
    app.register_blueprint(label_bp)

    return app
