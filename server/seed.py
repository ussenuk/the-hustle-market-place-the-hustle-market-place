# from app import app, db
# from models import Customer, ServiceProvider, Service, Booking, Review, Payment

# # Create an application context
# with app.app_context():
#     # Drop all existing tables and recreate them
#     Customer.query.delete()
#     ServiceProvider.query.delete()
#     Service.query.delete()
#     Booking.query.delete()
#     Review.query.delete()
#     Payment.query.delete()

#     # Create sample users
#     user1 = Customer(fullname='John Doe', username='john_doe', email='john@example.com', password='password1', location='New York')
#     user2 = Customer(fullname='Jane Doe', username='jane_doe', email='jane@example.com', password='password2', location='Los Angeles')
#     user3 = Customer(fullname='Alice Smith', username='alice_smith', email='alice@example.com', password='password3', location='San Francisco')

#     # Add users to session and commit
#     db.session.add_all([user1, user2, user3])
#     db.session.commit()

#     # Create sample service providers
#     service_provider1 = ServiceProvider(fullname='Julius Mwangi', username='jmwas', email='j@example.com', password='password1', service_title='Photographer', service_category='Photography', pricing=50, location='New York')
#     service_provider2 = ServiceProvider(fullname='Beatrice Wambua', username='bobo', email='bobo@example.com', password='password2', service_title='Graphic Designer', service_category='Design', pricing=60, location='Los Angeles')
#     service_provider3 = ServiceProvider(fullname='Will Smith', username='smith', email='smith@example.com', password='password3', service_title='Web Developer', service_category='Development', pricing=70, location='San Francisco')

#     # Add service providers to session and commit
#     db.session.add_all([service_provider1, service_provider2, service_provider3])
#     db.session.commit()

#     print("Database seeded successfully.")
# seed.py

from app import app, db
from datetime import datetime
from models import Customer, ServiceProvider, Service, Booking, Review, Payment

# Create an application context
with app.app_context():
    # Drop all existing tables and recreate them
    Customer.query.delete()
    ServiceProvider.query.delete()
    Service.query.delete()
    Booking.query.delete()
    Review.query.delete()
    Payment.query.delete()

    # Create sample users
    user1 = Customer(fullname='John Doe', username='john_doe', email='john@example.com', password='password1', location='New York')
    user2 = Customer(fullname='Jane Doe', username='jane_doe', email='jane@example.com', password='password2', location='Los Angeles')
    user3 = Customer(fullname='Alice Smith', username='alice_smith', email='alice@example.com', password='password3', location='San Francisco')

    # Add users to session and commit
    db.session.add_all([user1, user2, user3])
    db.session.commit()

    # Create sample service providers
    service_provider1 = ServiceProvider(fullname='Julius Mwangi', username='jmwas', email='j@example.com', password='password1', service_title='Photographer', service_category='Photography', pricing=50, location='New York')
    service_provider2 = ServiceProvider(fullname='Beatrice Wambua', username='bobo', email='bobo@example.com', password='password2', service_title='Graphic Designer', service_category='Design', pricing=60, location='Los Angeles')
    service_provider3 = ServiceProvider(fullname='Will Smith', username='smith', email='smith@example.com', password='password3', service_title='Web Developer', service_category='Development', pricing=70, location='San Francisco')

    # Add service providers to session and commit
    db.session.add_all([service_provider1, service_provider2, service_provider3])
    db.session.commit()

    # Create sample services
    service1 = Service(service_title='Photography', service_category='Photography', service_provider_id=service_provider1.id)
    service2 = Service(service_title='Graphic Design', service_category='Design', service_provider_id=service_provider2.id)
    service3 = Service(service_title='Web Development', service_category='Development', service_provider_id=service_provider3.id)

    # Add services to session and commit
    db.session.add_all([service1, service2, service3])
    db.session.commit()

    # Create sample bookings
    booking1 = Booking(service_provider_id=service_provider1.id, time_service_provider_booked=datetime.strptime('2024-04-20 10:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user1.id)
    booking2 = Booking(service_provider_id=service_provider2.id, time_service_provider_booked=datetime.strptime('2024-04-21 11:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user2.id)
    booking3 = Booking(service_provider_id=service_provider3.id, time_service_provider_booked=datetime.strptime('2024-04-22 12:00:00', '%Y-%m-%d %H:%M:%S'), customer_id=user3.id)

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

    print("Database seeded successfully.")
