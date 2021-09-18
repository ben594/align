# Routes for user login and credentials
from flask import Blueprint
bp = Blueprint('users', __name__)

from flask import render_template, redirect, url_for, flash, request
from werkzeug.urls import url_parse
from flask_login import login_user, logout_user, current_user
from .forms import LoginForm, RegistrationForm
from .models import User

from flask import current_app as app


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index.index'))
    form = LoginForm()
    if form.validate_on_submit():
        if not app.db.check_user_credentials(form.email.data, form.password.data):
            flash('Invalid email or password')
            return redirect(url_for('users.login'))
        user_info = app.db.get_user_info_by_email(form.email.data)
        user = User(user_info[0], user_info[1], user_info[2], user_info[3])
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index.index')

        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index.index'))


@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index.index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        if app.db.register_user(form.email.data,
                             form.password.data,
                             form.firstname.data,
                             form.lastname.data):
            flash('Congratulations, you are now a registered user!')
            return redirect(url_for('users.login'))
    return render_template('register.html', title='Register', form=form)


