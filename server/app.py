

# server/app.py

from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify, session
from config import app, db, CORS, api
from models import Customer, ServiceProvider, Payment, Review, Booking, Service, Admin
from flask_restful import Resource, reqparse
from werkzeug.utils import secure_filename
import os
from flask_login import LoginManager, login_user, logout_user, login_required, current_user

# Initialize Flask-Login
login_manager = LoginManager(app)
login_manager.login_view = 'login_user_route'  # specify the login view

@login_manager.user_loader
def load_user(user_id):
    
    return Customer.query.get(int(user_id))

@login_manager.unauthorized_handler
def handle_unauthorized():
    # This handler will redirect to appropriate login route based on the session
    if 'business_id' in session:
        return redirect(url_for('logout_business_route'))
    else:
        return redirect(url_for('login_user_route'))


# Home route
class Home(Resource):
    def get(self):
        if 'user_id' in session:
            return jsonify({
                "message": "Welcome to the Home Page",
                "status": "logged_in",
                "user_id": session['user_id']
            })
        elif 'business_id' in session:
            return jsonify({
                "message": "Welcome to the Home Page",
                "status": "logged_in",
                "business_id": session['business_id']
            })
        else:
            return jsonify({
                "message": "Welcome to the Home Page",
                "status": "logged_out"
            })

api.add_resource(Home, '/')


# @app.route('/admindashboard')
# @login_required
# def admin_dashboard():
#     return jsonify({'message': 'Welcome to the Admin Dashboard'}), 200


# Admin Registration
@app.route('/adminregister', methods=['POST'])
def register_admin():
    data = request.get_json()
    fullname = data.get('fullname')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not fullname or not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    if Admin.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), 409
    if Admin.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already in use'}), 409

    new_admin = Admin(fullname=fullname, username=username, email=email)
    new_admin.set_password(password)
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({'message': 'Admin registered successfully'}), 201

# Admin Login
@app.route('/adminlogin', methods=['POST'])
def login_admin_route():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    admin = Admin.query.filter_by(email=email).first()
    if admin and admin.check_password(password):
        session['admin_id'] = admin.id
        return jsonify({'message': 'Logged in successfully', 'admin_id': admin.id}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

# Admin Logout
@app.route('/adminlogout', methods=['GET'])
def logout_admin_route():
    if 'admin_id' in session:
        session.pop('admin_id')
    return jsonify({'message': 'Logout successful'}), 200

# User Registration
@app.route('/userregister', methods=['POST'])
def register_user():
    data = request.get_json()
    fullname = data.get('fullname')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    location = data.get('location')

    if not fullname or not username or not email or not password or not location:
        return jsonify({'error': 'Missing required fields'}), 400

    if Customer.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), 409
    if Customer.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already in use'}), 409

    new_user = Customer(fullname=fullname, username=username, email=email, location=location)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/userlogin', methods=['POST'])
def login_user_route():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = Customer.query.filter_by(email=email).first()
    if user and user.check_password(password):
        session['user_id'] = user.id
        # login_user(user)
        return jsonify({'message': 'Logged in successfully', 'user_id': user.id}), 200
    return jsonify({'error': 'Invalid credentials'}), 401


# User Logout
@app.route('/logout', methods=['GET'])
def logout_user_route():
    if 'user_id' in session:
        session.pop('user_id')
    
    return jsonify({'message': 'You have been logged out'}), 200



# Service Provider Registration

@app.route('/businessregister', methods=['POST'])
def register_business():
    data = request.get_json()

    # Extract fields from JSON data
    fullname = data.get('fullname')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    service_title = data.get('service_title')
    service_category = data.get('service_category')
    pricing = data.get('pricing')
    hours_available = data.get('hours_available')
    location = data.get('location')
    

    # Check for missing required fields
    if not fullname or not username or not email or not password or not service_title or not service_category or not pricing or not hours_available or not location :
        missing = ", ".join([field for field, value in [
            ('fullname', fullname), ('username', username), ('email', email), ('password', password),
            ('service_title', service_title), ('service_category', service_category), ('pricing', pricing),
            ('hours_available', hours_available), ('location', location)
        ] if not value])
        return jsonify({'error': f'Missing required fields: {missing}'}), 400

    

    # Create a new ServiceProvider instance
    service_provider = ServiceProvider(
        fullname=fullname,
        username=username,
        email=email,
        service_title=service_title,
        service_category=service_category,
        pricing=pricing,
        hours_available=hours_available,
        location=location
    )
    service_provider.set_password(password)
    db.session.add(service_provider)
    db.session.commit()

    return jsonify({'message': 'Registration successful'}), 201


# Service Provider Login
@app.route('/businesslogin', methods=['POST'])
def login_business_route():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    service_provider = ServiceProvider.query.filter_by(email=email).first()
    if service_provider and service_provider.check_password(password):
        session['business_id'] = service_provider.id
        return jsonify({'message': 'Logged in successfully', 'business_id': service_provider.id}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/addservices', methods=['POST'])
def add_service():
    try:
        data = request.json
        service_title = data.get('service_title')
        service_category = data.get('service_category')
        
        # Retrieve service provider ID from request headers
        service_provider_id = request.headers.get('ServiceProviderId')
        
        # If service provider ID is not found in headers, check session
        if not service_provider_id:
            service_provider_id = session.get('business_id')
        
        # If service provider ID is still not found, return an error
        if not service_provider_id:
            return jsonify({'error': 'Service provider ID not provided'}), 400

        new_service = Service(
            service_title=service_title,
            service_category=service_category,
            service_provider_id=service_provider_id
        )
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Service added successfully"}), 201
    except Exception as e:
        error_message = f"Failed to add service: {str(e)}"
        return jsonify({'error': error_message}), 500

@app.route('/businesslogout', methods=['GET'])
def logout_business_route():
    
    if 'business_id' in session:
        session.pop('business_id')
    return jsonify({'message': 'Logout successful'}), 200

class Bookings(Resource):
    def get(self):
        booking_records = Booking.query.all()

        booking_data = []

        for record in booking_records:
            # Fetching customer name
            customer_name = Customer.query.filter_by(id=record.customer_id).first().fullname
            # Fetching service provider name
            service_provider_name = ServiceProvider.query.filter_by(id=record.service_provider_id).first().fullname
            # Fetching payment status
            payment_status = Payment.query.filter_by(booking_id=record.id).first().payment_status if record.payments else None

            # Fetching service information
            service_info = Service.query.filter_by(service_provider_id=record.service_provider_id).first()
            service_title = service_info.service_title if service_info else None
            service_category = service_info.service_category if service_info else None

            booking_data.append(
                {
                    "booking_id": record.id,
                    "customer": customer_name,
                    "service_provider": service_provider_name,
                    "service_title": service_title,
                    "service_category": service_category,
                    "service_provider": service_provider_name,
                    "time_service_provider_booked": record.time_service_provider_booked,
                    "payment_status": payment_status
                }
            )
        return make_response(jsonify(booking_data), 200)
    
# Service API
class Services(Resource):
    def get(self):
        services = Service.query.all()

        serialized_services = []

        for service in services:
            # Fetch service provider name
            service_provider_name = ServiceProvider.query.filter_by(id=service.service_provider_id).first().fullname

            serialized_services.append({
                "service_id": service.id,
                "service_title": service.service_title,
                "service_category": service.service_category,
                "service_provider": service_provider_name,
                # Add other fields as needed
            })

        return make_response(jsonify(serialized_services), 200)
    
class ServiceProviders(Resource):
    def get(self):
        service_providers = ServiceProvider.query.all()
        serialized_service_provider = []

        for service_provider in service_providers:

            # Fetch service provider name
            service_provider_id = ServiceProvider.query.filter_by(id=service_provider.id).first().id
            service_provider_name = ServiceProvider.query.filter_by(id=service_provider.id).first().fullname
            service_provider_service_title = ServiceProvider.query.filter_by(id=service_provider.id).first().service_title

            serialized_service_provider.append({
                "id": service_provider_id,
                "service_provider": service_provider_name,
                "service_title": service_provider_service_title
                # Add other fields as needed
            })

        return make_response(jsonify(serialized_service_provider), 200)
   


api.add_resource(Services, "/services", endpoint="services")

api.add_resource(Bookings, "/booking", endpoint="booking")

api.add_resource(ServiceProviders, "/service_provider", endpoint="service_provider")


if __name__ == '__main__':
    app.run(port=5555, debug=True)


