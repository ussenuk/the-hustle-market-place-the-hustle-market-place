from flask import Flask, render_template, request, redirect, url_for, flash
from config import app, db, CORS
from models import Customer, ServiceProvider, Payment, Review, Booking, Service

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


if __name__ == '__main__':
    app.run(port=5555, debug=True)
