from flask import Flask, render_template, request, redirect, url_for, flash
from config import app, db, CORS


from models import Customer, ServiceProvider, Payment, Review, Booking, Service



# Home route
@app.route('/')
def home():
    return 'Welcome to the Home Page'

if __name__ == '__main__':
    app.run(debug=True)
