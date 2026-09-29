from flask import Flask, render_template, request, redirect, url_for, flash
from models import db
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///redgum.db'
app.config['SECRET_KEY'] = 'devkey123'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# 后面你在这里写网页路由（创建课时、课表视图等）
@app.route('/')
def index():
    return "Redgum Tutoring System"

if __name__ == '__main__':
    app.run(debug=True)
