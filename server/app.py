from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
# Import models
from models import Customer, ServiceProvider, Service, Booking, Review, Payment

# Home route
@app.route('/')
def home():
    return 'Welcome to the Home Page'

if __name__ == '__main__':
    app.run(debug=True)
