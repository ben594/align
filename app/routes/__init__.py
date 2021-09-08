from flask import Blueprint, redirect, render_template, url_for
from .db import DB

def create_app():
    routes = Blueprint('routes', __name__)

    from .accounts import *
    from .cart import *
    from .feedback import *
    from .inventory import *
    from .product import *
