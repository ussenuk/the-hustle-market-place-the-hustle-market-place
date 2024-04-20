from flask_sqlalchemy import SQLAlchemy

from config import db

class Customer(db.Model):
    __tablename__ = 'users'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    location = db.Column(db.String(255))
    purchases = db.Column(db.Text)

class ServiceProvider(db.Model):
    __tablename__ = 'service_providers'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    service_title = db.Column(db.String(255))
    service_category = db.Column(db.String(255))
    pricing = db.Column(db.Integer)
    hours_available = db.Column(db.DateTime)
    location = db.Column(db.String(255))
    profile_picture = db.Column(db.String(255))
    video_demo_of_service_offered = db.Column(db.String(255))
    documents = db.Column(db.String(255))

    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # user = db.relationship('User', backref=db.backref('service_providers', lazy=True))

class Service(db.Model):
    __tablename__ = 'services'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    service_title = db.Column(db.String(255))
    service_category = db.Column(db.String(255))
    # service_provider_id = db.Column(db.Integer, db.ForeignKey('service_provider.id'))
    # service_provider = db.relationship('ServiceProvider', backref=db.backref('services', lazy=True))

class Booking(db.Model):
    __tablename__ = 'bookings'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    # service_provider_id = db.Column(db.Integer, db.ForeignKey('service_provider.id'))
    time_service_provider_booked = db.Column(db.DateTime)
    # customer_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # service_provider = db.relationship('ServiceProvider', backref=db.backref('bookings', lazy=True))
    # customer = db.relationship('User', backref=db.backref('bookings', lazy=True))

class Review(db.Model):
    __tablename__ = 'reviews'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    stars_given = db.Column(db.Integer)
    comments = db.Column(db.String(255))
    # booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'))
    # customer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    average_rating = db.Column(db.Integer)

    # booking = db.relationship('Booking', backref=db.backref('reviews', lazy=True))
    # customer = db.relationship('User', backref=db.backref('reviews', lazy=True))

class Payment(db.Model):
    __tablename__ = 'payments'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    payment_status = db.Column(db.String(255))
    payment_option = db.Column(db.String(255))
    # booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'))
    # customer_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # booking = db.relationship('Booking', backref=db.backref('payments', lazy=True))
    # customer = db.relationship('User', backref=db.backref('payments', lazy=True))

