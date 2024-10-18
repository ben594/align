from app import create_app
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = create_app()
jwtManager = JWTManager(app)
CORS(app, supports_credentials=True)
