from flask import render_template, request, redirect, url_for
from app import app, db
from models import Student

@app.route('/')
def index():
    students = Student.query.all()
    return render_template("index.html", students=students)

@app.route('/add', methods=['GET','POST'])
def add():
    if request.method == "POST":
        name = request.form["name"]
        age = request.form["age"]
        s = Student(name=name, age=age)
        db.session.add(s)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template("add.html")
