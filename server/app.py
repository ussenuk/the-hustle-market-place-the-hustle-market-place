from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify,session
from config import app, db, CORS, api
from flask_cors import CORS
from models import Customer, ServiceProvider, Payment, Review, Booking, Service
from flask_restful import Resource, reqparse
# from datetime import datetime

# Home route
class Home(Resource):

    def get(self):

        response_dict = {
            "message": "Welcome to the Home Page",
        }

        response = make_response(
            response_dict,
            200
        )

        return response
    

  

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

# User Login
@app.route('/userlogin', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = Customer.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({'message': 'Logged in successfully'}), 200


# Business registration
@app.route('/businessregister', methods=['POST'])
def register():
    data = request.json

    # List of required fields
    required_fields = ['fullname', 'username', 'email', 'password',   
                       'service_title', 'service_category', 'pricing', 'location']
    
                    # 'hours_available',
                    #     'profile_picture', 
                    #    'video_demo_of_service_offered', 'documents']

    # Check for missing fields
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # Check for existing email
    if ServiceProvider.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400

    # Convert 'hours_available' from ISO 8601 string to datetime object
    # try:
    #     hours_available = datetime.fromisoformat(data['hours_available'])
    # except ValueError:
    #     return jsonify({'message': 'Invalid datetime format for hours available'}), 400

    # Create a new ServiceProvider instance
    service_provider = ServiceProvider(
        fullname=data['fullname'],
        username=data['username'],
        email=data['email'],
        service_title=data['service_title'],
        service_category=data['service_category'],
        pricing=data['pricing'],
        # hours_available=hours_available,
        location=data['location'],
        # profile_picture=data['profile_picture'],
        # video_demo_of_service_offered=data['video_demo_of_service_offered'],
        # documents=data['documents']
    )

    # Hash the password
    service_provider.set_password(data['password'])

    # Add to the session and commit to the database
    db.session.add(service_provider)
    db.session.commit()

    return jsonify({'message': 'Registration successful'}), 201


# Business login
@app.route('/businesslogin', methods=['POST'])
def login():
    data = request.json
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400

    service_provider = ServiceProvider.query.filter_by(email=data['email']).first()
    if not service_provider or not service_provider.check_password(data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # # Storing user id in session
    # session["user_id"] = service_provider.id
    # Handle authentication success here, for example, generate JWT token
    return service_provider.to_dict(), 200

# class CheckSession(Resource):
#     def get(self):
#         user_id = session.get('user_id')
#         if user_id:
#             user = ServiceProvider.query.filter(ServiceProvider.id == user_id).first()
#             return user.to_dict(), 200
#         return {'message': '401: Not Authorized'}, 401
        

# api.add_resource(Home, '/')
# api.add_resource(CheckSession, "/check_session")

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

api.add_resource(Services, "/services", endpoint="services")

api.add_resource(Bookings, "/booking", endpoint="booking")
api.add_resource(Home, "/")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
