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
    products = app.db.get_avail_products()
    products_list = [app.db.get_product_details(x[0])[0] for x in products]
    products_and_price = [(x[3],x[1]) for x in products_list]
    # find the products current user has bought
    purchases = app.db.get_purchase_history(current_user.id, datetime.datetime(1980,9,14,0,0,0))
    purchase_list = [app.db.get_product_details(x[0])[0] for x in purchases]
    purchase_name_and_price = [(x[3],x[1]) for x in purchase_list]
    # render the page by adding information to the index.html file
    return render_template('index.html', 
                            avail_products=products_and_price,
                            purchased_history=purchase_name_and_price)
