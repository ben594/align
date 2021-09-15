from flask import render_template
from flask_login import current_user, login_required
import datetime
from flask import current_app as app

from flask import Blueprint
bp = Blueprint('index', __name__)

@bp.route('/')
@login_required
def index():
    # get all the products for sale
    products = app.dbq.get_avail_products()
    # find the products current user has bought
    purchases = app.dbq.get_purchase_history(current_user.id, datetime.datetime(1980,9,14,0,0,0))
    #purchased_products = [db.get_product_details(x) for x in purchases]
    # render the page by adding information to the index.html file
    return render_template('index.html', 
                            avail_products=products,
                            purchased_history=purchases)
