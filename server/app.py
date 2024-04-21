from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify
from config import app, db, CORS, api
from flask_cors import CORS
from models import Customer, ServiceProvider, Payment, Review, Booking, Service
from flask_restful import Resource, reqparse

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

    new_user = Customer(fullname=fullname, username=username, email=email, password=password, location=location)
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



if __name__ == '__main__':
    app.run(port=5555, debug=True)
