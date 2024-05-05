

# server/config.py


from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_mail import Mail




app = Flask(__name__ , static_url_path='/static')
api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})



app.secret_key = b'Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# configuration from flask mail

app.config['MAIL_SERVER'] = "smtp.fastmail.com"
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USERNAME'] = 'hutlemarket@fastmail.com'
app.config['MAIL_PASSWORD'] = 'n2lrvy8yhnrg3dk2'
# app.config['MAIL_SERVER']='sandbox.smtp.mailtrap.io'
# app.config['MAIL_PORT'] = 2525
# app.config['MAIL_USERNAME'] = 'ee6c1ac5853f0d'
# app.config['MAIL_PASSWORD'] = '1b22a040a05587'
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = False
mail = Mail()
mail.init_app(app)


metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)

migrate = Migrate(app, db)


