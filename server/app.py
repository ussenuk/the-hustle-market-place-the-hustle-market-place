

# server/app.py

from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify, session, send_from_directory
from config import app, db, CORS, api, mail
from models import Customer, ServiceProvider, Payment, Review, Booking, Service, Admin
from flask_restful import Resource, reqparse
from werkzeug.utils import secure_filename
import os
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from validators import validate_file, validate_business_description
from flask_mail import Mail, Message
from flask_socketio import SocketIO, emit
import socketio


socketIO = SocketIO(app, cors_allowed_origins="*")

@app.route('/http-call')
def http_call():
    data={'data':"Text received"}
    return jsonify(data)

@socketio.on("connect")
def connected():
    print(request.sid, "connected")
    emit("connect", {"data":f"id: {request.sid} is connected"})

@socketio.on("data")
def handle_data(data):
    print("Data received:", str(data))
    emit("data", {"data":data, "id":request.sid}, broadcast=True)

@socketio.on("disconnect")
def disconnected():
    print("User disconnected")
    emit("disconnect", f"user: {request.sid} is disconnected",broadcast=True)




from datetime import datetime
#Sending an email using Flask-Mail

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    email_addresses = data.get('emailAddresses')
    additional_info = data.get('additionalInfo')
    recipients = email_addresses.split(',')  # Split email addresses by comma
    
    # Customize the email body with additional information
    message_body = f'This is an invitation email sent from HutleMarket Place!\n\nAdditional information: {additional_info}'

    message = Message('Hutle Market invitation Email', sender='hutlemarket@fastmail.com', recipients=recipients)
    message.body = message_body
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


# User Login
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





@app.route('/search_services', methods=['GET'])
def search_services():
    # Extract search parameters from the request
    data = request.json
    search_query = data.get('searchQuery')
    service_category = data.get('serviceCategory')

    # Query services based on the search parameters
    if not search_query:
        return jsonify({'error': 'Missing search query'}), 400

    filtered_services = Service.query.filter(Service.service_title.ilike(f'%{search_query}%'))

    # Filter by service category
    if service_category:
        filtered_services = filtered_services.filter(Service.service_category == service_category)

    # Check if any services match the search criteria
    if filtered_services.count() == 0:
        return jsonify({'error': 'No matching services found'}), 404

    serialized_services = [
        {
            'service_id': service.id,
            'service_title': service.service_title,
            'service_price': service.service_price,
            'service_category': service.service_category
        }
        for service in filtered_services
    ]

    return jsonify(serialized_services), 200


""" @app.route('/search_services', methods=['POST'])
def search_services():
    # Extract search parameters from the request
    data = request.json
    search_query = data.get('searchQuery')
    min_price = data.get('minPrice')
    max_price = data.get('maxPrice')
    availability_hours = data.get('availabilityHours')
    service_category = data.get('serviceCategory')
    user_rating = data.get('userRating')

    # Query services based on the search parameters
    filtered_services = Service.query.filter(Service.service_title.ilike(f'%{search_query}%'))

    # Filter by price range
    if min_price and max_price:
        filtered_services = filtered_services.filter(Service.service_price.between(min_price, max_price))

    # Filter by availability hours
    if availability_hours:
        filtered_services = filtered_services.filter(Service.availability_hours == availability_hours)

    # Filter by service category
    if service_category:
        filtered_services = filtered_services.filter(Service.service_category == service_category)

    # Filter by user rating
    if user_rating:
        filtered_services = filtered_services.filter(Service.user_rating == user_rating)

    # Serialize the filtered services
    serialized_services = [
        {
            'service_id': service.id,
            'service_title': service.service_title,
            'service_price': service.service_price,
            # Add other fields as needed
        }
        for service in filtered_services
    ]

    return jsonify(serialized_services), 200 """




# Service Provider Registration
@app.route('/businessregister', methods=['POST'])
def register_business():
    # data = request.get_json()

    
    # Extract fields from form data
    fullname = request.form.get('fullname')
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    service_title = request.form.get('service_title')
    service_category = request.form.get('service_category')
    pricing = request.form.get('pricing')
    hours_available = request.form.get('hours_available')
    location = request.form.get('location')
    business_description = request.form.get('business_description')
    profile_picture = request.files.get('profile_picture')
    video = request.files.get('video')
    work_images = request.files.get('work_images')
    registration_document = request.files.get('registration_document')


    # Check for missing required fields
    if not fullname or not username or not email or not password or not service_title or not service_category or not pricing or not hours_available or not location or not business_description:
        missing = ", ".join([field for field, value in [
            ('fullname', fullname), ('username', username), ('email', email), ('password', password),
            ('service_title', service_title), ('service_category', service_category), ('pricing', pricing),
            ('hours_available', hours_available), ('location', location), ('business_description', business_description)
        ] if not value])
        return jsonify({'error': f'Missing required fields: {missing}'}), 400
    
    # Check for missing required file uploads
    required_files = [
        ('profile_picture', profile_picture), ('registration_document', registration_document), 
        ('work_images', work_images)
    ]
    missing_files = ", ".join([field for field, file in required_files if file is None])
    if missing_files:
        return jsonify({'error': f'Missing required files: {missing_files}'}), 400
    

    # Validate file types
    if not validate_file(profile_picture, ['image/jpeg', 'image/png']):
        return jsonify({'error': 'Profile picture must be in JPEG or PNG format'}), 400

    if video and not validate_file(video, ['video/mp4']):
        return jsonify({'error': 'Video must be in MP4 format'}), 400
    
     # Validate file types
    if not validate_file(work_images, ['image/jpeg', 'image/png']):
        return jsonify({'error': 'Work image must be in JPEG or PNG format'}), 400

    if not validate_file(registration_document, ['application/pdf', 'image/jpeg', 'image/png']):
        return jsonify({'error': 'Registration document must be in PDF, JPEG, or PNG format'}), 400

    # Validate business description length
    if not validate_business_description(business_description):
        return jsonify({'error': 'Business description must be between 200 and 1000 characters'}), 400

    
    # Customize filename based on username or fullname and file extension
    filename_prefix = username
    profile_picture_filename = secure_filename(f"{filename_prefix}_profile_picture.{profile_picture.filename.rsplit('.', 1)[1]}")
    registration_document_filename = secure_filename(f"{filename_prefix}_registration_document.{registration_document.filename.rsplit('.', 1)[1]}")
    
    

    # Save files to a directory and store their names in the database
    # profile_picture_filename = secure_filename(profile_picture.filename)
    # registration_document_filename = secure_filename(registration_document.filename)

    # Save files
    profile_picture.save(os.path.join('static/uploads', profile_picture_filename))
    registration_document.save(os.path.join('static/uploads', registration_document_filename))

    video_filename = None
    work_images_filename = None

    if video:
        video_filename = secure_filename(f"{filename_prefix}_video.{video.filename.rsplit('.', 1)[1]}")
        # video_filename = secure_filename(video.filename)
        video.save(os.path.join('static/uploads', video_filename))

    if work_images:
        work_images_filename = secure_filename(f"{filename_prefix}_work_images.{work_images.filename.rsplit('.', 1)[1]}")
        # work_images_filename = secure_filename(work_images.filename)
        work_images.save(os.path.join('static/uploads', work_images_filename))


    # Create a new ServiceProvider instance
    service_provider = ServiceProvider(
        fullname=fullname,
        username=username,
        email=email,
        service_title=service_title,
        service_category=service_category,
        pricing=pricing,
        hours_available=hours_available,
        location=location,
        business_description=business_description,
        profile_picture=profile_picture_filename,
        registration_document=registration_document_filename,
        video=video_filename,
        work_images=work_images_filename,
    )

    service_provider.set_password(password)
    db.session.add(service_provider)
    db.session.commit()

    return jsonify({'message': 'Registration successful'}), 201


# Service Provider Login
@app.route('/businesslogin', methods=['POST'])
def login_business_route():
    
    email = request.form.get('email')
    password = request.form.get('password')

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
        location = data.get('location')
        pricing = data.get('pricing')
        hours_available = data.get('hours_available')
        
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
            location=location,
            pricing=pricing,
            hours_available=hours_available,
            service_provider_id=service_provider_id
        )
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Service added successfully"}), 201
    except Exception as e:
        error_message = f"Failed to add service: {str(e)}"
        return jsonify({'error': error_message}), 500

# Service Provider Logout
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

@app.route('/bookings/<int:service_provider_id>', methods=['GET'])
def get_bookings_by_service_provider(service_provider_id):
    # Filter bookings by service_provider_id
    booking_records = Booking.query.filter_by(service_provider_id=service_provider_id).all()

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
            service_provider_price = ServiceProvider.query.filter_by(id=service.service_provider_id).first().pricing

            serialized_services.append({
                "service_id": service.id,
                "service_title": service.service_title,
                "service_category": service.service_category,
                "pricing": service_provider_price,
                "service_provider": service_provider_name,
                "location": service.location,  # Add location field
                "hours_available": service.hours_available,  # Add hours_available field
                "pricing": service.pricing,  # Add pricing field
                # Add other fields as needed
            })

        return make_response(jsonify(serialized_services), 200)

    
    
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

class ServiceProviders(Resource):
    def get(self):
        service_providers = ServiceProvider.query.all()
        serialized_service_provider = []

        for service_provider in service_providers:

            # Fetch service provider name
            service_provider_id = service_provider.id
            service_provider_username = service_provider.username
            service_provider_name = service_provider.fullname
            service_provider_service_title = service_provider.service_title
            service_provider_bio = service_provider.business_description

            # Construct filenames based on filename prefix
            filename_prefix = service_provider_username  # Assuming username is used as filename prefix
            
            profile_picture_url = None
            video_url = None
            work_images_url = None
            registration_document_url = None

            if service_provider.profile_picture:
                profile_picture_filename = f"{filename_prefix}_profile_picture.{service_provider.profile_picture.split('.')[-1]}"
                profile_picture_url = url_for('static', filename=f'uploads/{profile_picture_filename}')

            if service_provider.video:
                video_filename = f"{filename_prefix}_video.{service_provider.video.split('.')[-1]}"
                video_url = url_for('static', filename=f'uploads/{video_filename}')

            if service_provider.work_images:
                work_images_filename = f"{filename_prefix}_work_images.{service_provider.work_images.split('.')[-1]}"
                work_images_url = url_for('static', filename=f'uploads/{work_images_filename}')

            if service_provider.registration_document:
                registration_document_filename = f"{filename_prefix}_registration_document.{service_provider.registration_document.split('.')[-1]}"
                registration_document_url = url_for('static', filename=f'uploads/{registration_document_filename}')

            serialized_service_provider.append({
                "id": service_provider_id,
                "service_provider": service_provider_name,
                "service_title": service_provider_service_title,
                "bio": service_provider_bio,
                "profile_picture_url": profile_picture_url,
                "video_url": video_url,
                "work_images_url": work_images_url,
                "registration_document_url": registration_document_url,
                # Add other fields as needed
            })

        return make_response(jsonify(serialized_service_provider), 200)

@app.route('/search/providers', methods=['GET'])
def search_providers():
    # Get search parameters from the request
    availability_hours = request.args.get('availabilityHours')
    user_rating = request.args.get('userRating')

    # Query service providers based on search parameters
    filtered_providers = ServiceProvider.query.all()
    if availability_hours:
        filtered_providers = [provider for provider in filtered_providers if provider.availability_hours == availability_hours]
        
    if user_rating:
        filtered_providers = [provider for provider in filtered_providers if provider.user_rating == user_rating]

    # Serialize the service providers and return as JSON response
    serialized_providers = [{"id": provider.id, "full_name": provider.full_name} for provider in filtered_providers]
    return jsonify(serialized_providers)

# @app.route('/services/provider', methods=['GET'])
# def get_services_by_provider():
#     try:
#         # Retrieve service provider ID from request headers
#         service_provider_id = request.headers.get('ServiceProviderId')
        
#         # If service provider ID is not found in headers, check session
#         if not service_provider_id:
#             service_provider_id = session.get('business_id')
        
#         # If service provider ID is still not found, return an error
#         if not service_provider_id:
#             return jsonify({'error': 'Service provider ID not provided'}), 400

#         # Retrieve services associated with the logged-in provider
#         services = Service.query.filter_by(service_provider_id=service_provider_id).all()

#         serialized_services = []

#         for service in services:
#             serialized_services.append({
#                 "service_id": service.id,
#                 "service_title": service.service_title,
#                 "service_category": service.service_category,
#                 "service_provider": service_provider_id,
#                 "pricing": service.pricing,
#                 "hours_available": service.hours_available,
#                 "location": service.location
#                 # Add other fields as needed
#             })

#         return jsonify(serialized_services), 200
#     except Exception as e:
#         error_message = f"Failed to fetch services: {str(e)}"
#         return jsonify({'error': error_message}), 500

@app.route('/add_booking', methods=['POST'])
def add_booking():
    try:
        data = request.json
        
        # Extract required data from the request
        service_provider_id = data.get('service_provider_id')
        customer_id = data.get('customer_id')  # Replacing customer_id with user_id
        time_service_provider_booked = data.get('time_service_provider_booked')

        # Convert time_booked string to datetime object if it is provided
        time_booked = None
        if time_service_provider_booked:
            time_booked = datetime.strptime(time_service_provider_booked, '%Y-%m-%d %H:%M:%S')

        print(f'{time_service_provider_booked}')
        print(f'{time_booked}')
        # Create a new booking object
        new_booking = Booking(
            service_provider_id=service_provider_id,
            customer_id=customer_id,  # Updated to user_id
            time_service_provider_booked=time_booked
        )

        # Add the booking to the database
        db.session.add(new_booking)
        db.session.commit()

        return jsonify({"message": "Booking created successfully"}), 201
    except Exception as e:
        error_message = f"Failed to create booking: {str(e)}"
        return jsonify({'error': error_message}), 500
        
@app.route('/bookings/<int:service_provider_id>', methods=['GET'])
def get_bookings_for_service_provider(service_provider_id):
    try:
        bookings = Booking.query.filter_by(service_provider_id=service_provider_id).all()

        serialized_bookings = []

        for booking in bookings:
            serialized_bookings.append({
                "id": booking.id,
                "time_service_provider_booked": booking.time_service_provider_booked,
                "customer_id": booking.customer_id,
                # Add other fields as needed
            })

        return jsonify(serialized_bookings), 200
    except Exception as e:
        error_message = f"Failed to fetch bookings: {str(e)}"
        return jsonify({'error': error_message}), 500

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
    def get(self, user_id, user_type):
        if user_type == 'customer':
            customer = Customer.query.filter_by(id=user_id).first()
            if customer:
                serialized_customer = {
                    "id": customer.id,
                    "fullname": customer.fullname,
                    "username": customer.username,
                    "email": customer.email,
                    "location": customer.location,
                    "user_type": "customer"
                    # Add other fields as needed
                }
                return serialized_customer, 200
            else:
                return {"error": "Customer not found"}, 404
        elif user_type == 'service_provider':
            service_provider = ServiceProvider.query.filter_by(id=user_id).first()
            if service_provider:
                serialized_service_provider = {
                    "id": service_provider.id,
                    "fullname": service_provider.fullname,
                    "username": service_provider.username,
                    "email": service_provider.email,
                    "location": service_provider.location,
                    "business_description": service_provider.business_description,
                    "user_type": "service_provider"
                    # Add other fields as needed
                }
                return serialized_service_provider, 200
            else:
                return {"error": "Service provider not found"}, 404
        else:
            return {"error": "Invalid user type specified"}, 400
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

    def patch(self, user_id, user_type):
        data = request.get_json()
        if not data:
            return {"error": "No data provided in the request"}, 400

        if user_type == 'service_provider':
            service_provider = ServiceProvider.query.filter_by(id=user_id).first()
            if not service_provider:
                return {"error": "Service Provider not found"}, 404

            if 'fullname' in data:
                service_provider.fullname = data['fullname']
            if 'email' in data:
                service_provider.email = data['email']
            if 'location' in data:
                service_provider.location = data['location']
            if 'business_description' in data:
                service_provider.business_description = data['business_description']

            db.session.commit()

            updated_service_provider = {
                "id": service_provider.id,
                "fullname": service_provider.fullname,
                "username": service_provider.username,
                "email": service_provider.email,
                "location": service_provider.location,
                "business_description": service_provider.business_description
            }

            return updated_service_provider, 200
        else:
            return {"error": "Invalid user type specified or user type not supported for patch operation"}, 400

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

