

# server/models.py

from flask_sqlalchemy import SQLAlchemy

from werkzeug.security import generate_password_hash, check_password_hash

from sqlalchemy_serializer import SerializerMixin

from config import db

from flask_login import UserMixin


class Admin(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'admins'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Customer(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    password_hash = db.Column(db.String(128))
    location = db.Column(db.String(255))


    purchases = db.Column(db.Text)

    bookings = db.relationship('Booking', backref=db.backref('user', lazy=True))
    reviews = db.relationship('Review', backref=db.backref('user', lazy=True))
    payments = db.relationship('Payment', backref=db.backref('user', lazy=True))

    serialize_rules = ('-bookings.user',)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    # def _repr_(self):
    #     return f'<Customer {self.username}>'

class ServiceProvider(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'service_providers'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    password_hash = db.Column(db.String(255))
    service_title = db.Column(db.String(255))
    service_category = db.Column(db.String(255))
    pricing = db.Column(db.Integer)
    hours_available = db.Column(db.String(255))
    location = db.Column(db.String(255))
    business_description = db.Column(db.Text)
    profile_picture = db.Column(db.String(255))
    video = db.Column(db.String(255))
    work_images = db.Column(db.Text)  # JSON or delimited string
    registration_document = db.Column(db.String(255))


    bookings = db.relationship('Booking', backref=db.backref('service_provider', lazy=True))
    services = db.relationship('Service', backref=db.backref('service_provider', lazy=True))

    serialize_rules = ('-bookings.service_provider',)

    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # user = db.relationship('User', backref=db.backref('service_providers', lazy=True))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Service(db.Model, SerializerMixin):
    __tablename__ = 'services'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    service_title = db.Column(db.String(255))
    service_category = db.Column(db.String(255))
    service_provider_id = db.Column(db.Integer, db.ForeignKey('service_providers.id'))
    hours_available = db.Column(db.String(255))  # Assuming hours available is a string field
    pricing = db.Column(db.Integer)  # Change the data type to db.Integer for pricing
    location = db.Column(db.String(255))
    # service_provider = db.relationship('ServiceProvider', backref=db.backref('services', lazy=True))

class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    service_provider_id = db.Column(db.Integer, db.ForeignKey('service_providers.id'))
    time_service_provider_booked = db.Column(db.DateTime)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    reviews = db.relationship('Review', backref=db.backref('booking', lazy=True))
    payments = db.relationship('Payment', backref=db.backref('booking', lazy=True))

    serialize_rules = ('-user.bookings', '-service_provider.bookings')


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    stars_given = db.Column(db.Integer)
    comments = db.Column(db.String(255))
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    average_rating = db.Column(db.Integer)

    # booking = db.relationship('Booking', backref=db.backref('reviews', lazy=True))
    # customer = db.relationship('User', backref=db.backref('reviews', lazy=True))

class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'  # Explicitly specify table name
    id = db.Column(db.Integer, primary_key=True)
    payment_status = db.Column(db.String(255))
    payment_option = db.Column(db.String(255))
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # booking = db.relationship('Booking', backref=db.backref('payments', lazy=True))
    # customer = db.relationship('User', backref=db.backref('payments', lazy=True))