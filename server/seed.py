
from app import app, db
from datetime import datetime
from models import Customer, ServiceProvider, Service, Booking, Review, Payment, Message

# Create an application context
with app.app_context():
    # Drop all existing tables and recreate them
    Customer.query.delete()
    ServiceProvider.query.delete()
    Service.query.delete()
    Booking.query.delete()
    Review.query.delete()
    Payment.query.delete()
    Message.query.delete()


    # Create sample users
    user1 = Customer(fullname='John Doe', username='john_doe', email='john@example.com', location='New York')
    user2 = Customer(fullname='Jane Doe', username='jane_doe', email='jane@example.com',  location='Los Angeles')
    user3 = Customer(fullname='Alice Smith', username='alice_smith', email='alice@example.com' , location='San Francisco')
    user4 = Customer(fullname='James Doe1', username='john_doe1', email='john1@example.com', location='New York')
    user5 = Customer(fullname='June Doe1', username='jane_doe1', email='jane1@example.com',  location='Los Angeles')
    user6 = Customer(fullname='Alie hu', username='alice_smith1', email='alice1@example.com' , location='San Francisco')
    user7 = Customer(fullname='Johnathan Doe', username='john_doe2', email='john2@example.com', location='New York')
    user8 = Customer(fullname='Janeth Doe', username='jane_doe2', email='jane2@example.com',  location='Los Angeles')
    user9 = Customer(fullname='Alicya Smith', username='alice_smith2', email='alice2@example.com' , location='San Francisco')
    user10 = Customer(fullname='Jammy Doe1', username='john_doe13', email='john3@example.com', location='New York')
    user11 = Customer(fullname='July Doe1', username='jane_doe13', email='jane3@example.com',  location='Los Angeles')
    user12 = Customer(fullname='Alid hu', username='alice_smith3', email='alice3@example.com' , location='San Francisco')
    # Add users to session and commit
    db.session.add_all([user1, user2, user3,user4, user5, user6,user7, user8, user9,user10, user11, user12])
    db.session.commit()

    # Create sample service providers
    service_provider1 = ServiceProvider(fullname='Julius Mwangi', username='jmwas', email='j@example.com', service_title='Photographer', service_category='Photography', pricing=50, location='New York', business_description='Photographers usually take photos of people, places, animals, events and objects. The type of photographer you are and the categorisation of your photography business are often based on the subjects of your photography. There are many different types of photographers.', hours_available='8 AM to 10 PM', profile_picture='jmwas_profile_picture.jpg', work_images='jmwas_work_images.jpg')
    service_provider2 = ServiceProvider(fullname='Beatrice Wambua', username='bobo', email='bobo@example.com', service_title='Graphic Designer', service_category='Design', pricing=60, location='Los Angeles', business_description='create visual communications such as adverts, branding, publicity materials and magazine layouts. Graphic designers (who may also be known as graphic artists) utilise graphic design skills to create media products such as magazines, labels, advertising and signage.', hours_available='8 AM to 10 PM', profile_picture='bobo_profile_picture.jpg', work_images='bobo_work_images.jpg')
    service_provider3 = ServiceProvider(fullname='Will Smith', username='smith', email='smith@example.com', service_title='Web Developer', service_category='Development', pricing=70, location='San Francisco',business_description='A Web Developer, or Website Developer, is responsible for using their knowledge of programming languages to code websites and web applications. Their duties include communicating with clients to determine their needs and design preferences, creating code for the front and back-end of a website and running tests to ensure that they used the correct code strings.',hours_available='8 AM to 10 PM', profile_picture='smith_profile_picture.jpg', work_images='smith_work_images.jpg')

    # Add service providers to session and commit
    db.session.add_all([service_provider1, service_provider2, service_provider3])
    db.session.commit()

    # Create sample services
    service1 = Service(service_title='Photography', service_category='Photography', service_provider_id=service_provider1.id, pricing=50, location='New York', hours_available='8 AM to 5 PM')
    service2 = Service(service_title='Graphic Design', service_category='Design', service_provider_id=service_provider2.id, pricing=60, location='Los Angeles', hours_available='8 AM to 5 PM')
    service3 = Service(service_title='Web Development', service_category='Development', service_provider_id=service_provider3.id, pricing=70, location='San Francisco', hours_available='8 AM to 5 PM')

    # Add services to session and commit
    db.session.add_all([service1, service2, service3])
    db.session.commit()

    # Create sample bookings
    booking1 = Booking(service_provider_id=service_provider1.id, time_service_provider_booked=datetime.strptime('2024-04-20 10:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user1.id)
    booking2 = Booking(service_provider_id=service_provider2.id, time_service_provider_booked=datetime.strptime('2024-04-21 11:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user2.id)
    booking3 = Booking(service_provider_id=service_provider3.id, time_service_provider_booked=datetime.strptime('2024-04-22 12:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user3.id)
    booking4 = Booking(service_provider_id=service_provider1.id, time_service_provider_booked=datetime.strptime('2024-04-20 10:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user4.id)
    booking5 = Booking(service_provider_id=service_provider2.id, time_service_provider_booked=datetime.strptime('2024-04-21 11:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user5.id)
    booking6 = Booking(service_provider_id=service_provider3.id, time_service_provider_booked=datetime.strptime('2024-04-22 12:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user6.id)
    booking7 = Booking(service_provider_id=service_provider1.id, time_service_provider_booked=datetime.strptime('2024-04-20 10:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user7.id)
    booking8 = Booking(service_provider_id=service_provider2.id, time_service_provider_booked=datetime.strptime('2024-04-21 11:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user8.id)
    booking9 = Booking(service_provider_id=service_provider3.id, time_service_provider_booked=datetime.strptime('2024-04-22 12:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user9.id)
    booking10 = Booking(service_provider_id=service_provider1.id, time_service_provider_booked=datetime.strptime('2024-04-20 10:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user10.id)
    booking11 = Booking(service_provider_id=service_provider2.id, time_service_provider_booked=datetime.strptime('2024-04-21 11:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user11.id)
    booking12 = Booking(service_provider_id=service_provider3.id, time_service_provider_booked=datetime.strptime('2024-04-22 12:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user12.id)
    # Add bookings to session and commit
    db.session.add_all([booking1, booking2, booking3])
    db.session.commit()

    # Create sample reviews
    review1 = Review(stars_given=4, comments="Great service!", booking_id=1, customer_id=1, average_rating=4)
    review2 = Review(stars_given=5, comments="Excellent work!", booking_id=2, customer_id=2, average_rating=5)
    review3 = Review(stars_given=3, comments="Good experience.", booking_id=3, customer_id=3, average_rating=3)
    # Add reviews to session and commit
    db.session.add_all([review1, review2, review3])
    db.session.commit()

    # Create sample payments
    payment1 = Payment(payment_status='Paid', payment_option='Credit Card', booking_id=1, customer_id=1)
    payment2 = Payment(payment_status='Paid', payment_option='PayPal', booking_id=2, customer_id=2)
    payment3 = Payment(payment_status='Paid', payment_option='Bank Transfer', booking_id=3, customer_id=3)


    # Add payments to session and commit
    db.session.add_all([payment1, payment2, payment3])
    db.session.commit()



    #Add sample messages
    message1 = Message(sender_id=1, sender_name="John Doe", receiver_id=2, content="Hello, I want to book a service. Can you help me?")
    message2 = Message(sender_id=2, sender_name="Jane Smith", receiver_id=1, content="Sure, I'll get back to you as soon as possible.")
    message3 = Message(sender_id=1, sender_name="John Doe", receiver_id=2, content="Thank you for your time. I'll be in touch soon.")
    message4 = Message(sender_id=2, sender_name="Jane Smith", receiver_id=1, content="Great! I'll be in touch soon to schedule the service.")

    # Add messages to session and commit
    db.session.add_all([message1, message2, message3, message4])
    db.session.commit()



    



    print("Database seeded successfully.")
