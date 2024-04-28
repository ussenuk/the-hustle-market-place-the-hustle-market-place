from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify
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

api.add_resource(Home, '/')


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

    # Handle authentication success here, for example, generate JWT token
    return jsonify({'message': 'Login successful'}), 200

@app.route('/services', methods=['POST'])
def add_service():
    try:
        data = request.json
        new_service = Service(
            service_title=data['service_title'],
            service_category=data['service_category'],
            service_provider_id=1  # Assuming service provider ID, adjust as needed
        )
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Service added successfully"}), 201
    except Exception as e:
        error_message = f"Failed to add service: {str(e)}"
        return jsonify({'error': error_message}), 500

from flask import jsonify

@app.route('/services', methods=['GET'])
def get_services():
    try:
        services = Service.query.all()
        serialized_services = []
        for service in services:
            serialized_service = {
                'id': service.id,
                'service_title': service.service_title,
                'service_category': service.service_category,
                'service_provider_id': service.service_provider_id
                # Add more fields if needed
            }
            serialized_services.append(serialized_service)
        return jsonify(serialized_services), 200
    except Exception as e:
        error_message = f"Failed to fetch services: {str(e)}"
        return jsonify({'error': error_message}), 500



if __name__ == '__main__':
    app.run(port=5555, debug=True)
