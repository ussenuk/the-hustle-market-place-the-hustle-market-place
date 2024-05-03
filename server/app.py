

# server/app.py

from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify, session
from config import app, db, CORS, api, mail
from models import Customer, ServiceProvider, Payment, Review, Booking, Service, Admin
from flask_restful import Resource, reqparse
from werkzeug.utils import secure_filename
import os
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_mail import Mail, Message
#Sending an email using Flask-Mail

@app.route('/send-email')
def send_email():
    message = Message('Test 2 Email', sender='hutlemarket@fastmail.com', recipients = ['ukimanuka@gmail.com'])
    message.body = 'This is a test email sent from Flask!'
    mail.send(message)
    return 'Email sent!'


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
   
class Admins(Resource):
    def get(self):
        admins = Admin.query.all()
        serialized_admin = []

        for admin in admins:

            # Fetch admin name
            admin_id = Admin.query.filter_by(id=admin.id).first().id
            admin_name = Admin.query.filter_by(id=admin.id).first().fullname
            
            serialized_admin.append({
                "id": admin_id,
                "admin": admin_name
                # Add other fields as needed
            })

        return make_response(jsonify(serialized_admin), 200)
    
class AllUsers(Resource):
    def get(self):
        service_providers = ServiceProvider.query.all()
        customers = Customer.query.all()
        serialized_service_providers = []
        serialized_customers = []

        # Serialize service providers
        for service_provider in service_providers:
            serialized_service_providers.append({
                "id": service_provider.id,
                "fullname": service_provider.fullname,
                "username":service_provider.username,
                "email":service_provider.email,
                "location":service_provider.location,
                "service_title": service_provider.service_title,
                "user_type": "service_provider"
                # Add other fields as needed
            })

        # Serialize customers
        for customer in customers:
            serialized_customers.append({
                "id": customer.id,
                "fullname": customer.fullname,
                "username":customer.username,
                "email":customer.email,
                "location":customer.location,
                "service_title": "Customer",
                "user_type": "customer"

                # Add other fields as needed
            })

        # Return both serialized lists
        return make_response(jsonify(serialized_service_providers, serialized_customers), 200)
    
class AllUser(Resource):
    def delete(self, user_id, user_type):
        if user_type == 'customer':
            customer = Customer.query.filter_by(id=user_id).first()
            if customer:
                # Delete associated customer bookings
                customer_bookings = Booking.query.filter_by(customer_id=user_id).all()
                for booking in customer_bookings:
                    db.session.delete(booking)
                db.session.delete(customer)
                db.session.commit()
                return {"message": "Customer and associated bookings deleted successfully"}, 200
            else:
                return {"error": "Customer not found"}, 404
        elif user_type == 'service_provider':
            service_provider = ServiceProvider.query.filter_by(id=user_id).first()
            if service_provider:
                # Delete associated service provider bookings
                service_provider_bookings = Booking.query.filter_by(service_provider_id=user_id).all()
                for booking in service_provider_bookings:
                    db.session.delete(booking)
                # Delete associated services
                services = Service.query.filter_by(service_provider_id=user_id).all()
                for service in services:
                    db.session.delete(service)
                db.session.delete(service_provider)
                db.session.commit()
                return {"message": "Service provider, associated services, and bookings deleted successfully"}, 200
            else:
                return {"error": "Service provider not found"}, 404
        else:
            return {"error": "Invalid user type specified"}, 400

        
    def patch(self, user_id):
        data = request.get_json()
        if not data:
            return {"error": "No data provided in the request"}, 400

        customer = db.session.get(Customer, user_id)
        if not customer:
            return {"error": "User not found"}, 404

        if 'fullname' in data:
            customer.fullname = data['fullname']
        if 'email' in data:
            customer.email = data['email']
        if 'location' in data:
            customer.location = data['location']

        db.session.commit()

        updated_customer = {
            "id": customer.id,
            "fullname": customer.fullname,
            "username": customer.username,
            "email": customer.email,
            "location": customer.location
        }

        return updated_customer, 200

# Payment API endpoints
class Payments(Resource):
    # Endpoint to create a new payment
    def post(self):
        data = request.get_json()
        payment_status = data.get('payment_status')
        payment_option = data.get('payment_option')
        booking_id = data.get('booking_id')
        customer_id = data.get('customer_id')

        if not all([payment_status, payment_option, booking_id, customer_id]):
            return {"error": "Missing required fields"}, 400

        new_payment = Payment(
            payment_status=payment_status,
            payment_option=payment_option,
            booking_id=booking_id,
            customer_id=customer_id
        )
        db.session.add(new_payment)
        db.session.commit()

        return {"message": "Payment created successfully", "payment_id": new_payment.id}, 201

    # Endpoint to retrieve all payments
    def get(self):
        payments = Payment.query.all()
        serialized_payments = []

        for payment in payments:
            serialized_payments.append({
                "id": payment.id,
                "payment_status": payment.payment_status,
                "payment_option": payment.payment_option,
                "booking_id": payment.booking_id,
                "customer_id": payment.customer_id
                # Add other fields as needed
            })

        return make_response(jsonify(serialized_payments), 200)    

api.add_resource(Services, "/services", endpoint="services")

api.add_resource(Bookings, "/booking", endpoint="booking")

api.add_resource(ServiceProviders, "/service_provider", endpoint="service_provider")

api.add_resource(Admins, "/admin", endpoint="admin")

api.add_resource(AllUsers, "/users", endpoint="users")

api.add_resource(AllUser, "/user/<int:user_id>/<string:user_type>", endpoint="user")

api.add_resource(Payments, "/payments", endpoint="payments")


if __name__ == '__main__':
    app.run(port=5555, debug=True)


