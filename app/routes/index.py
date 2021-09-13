from flask import render_template
from flask_login import current_user, login_required


from flask import Blueprint
bp = Blueprint('index', __name__)

@bp.route('/')
@login_required
def index():
    return render_template('index.html')