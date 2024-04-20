from app import app, db
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

    print("Database seeded successfully.")
