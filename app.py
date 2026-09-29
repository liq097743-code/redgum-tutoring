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

from datetime import date, timedelta

# 新建课时表单页面
@app.route('/session/new', methods=['GET','POST'])
def session_new():
    from models import Student, Tutor, Session, TutorAvailability
    if request.method == 'POST':
        student_id = request.form['student_id']
        tutor_id = request.form['tutor_id']
        session_date = date.fromisoformat(request.form['session_date'])
        start_time = request.form['start_time']
        duration = int(request.form['duration_minutes'])

        new_session = Session(
            student_id=student_id,
            tutor_id=tutor_id,
            session_date=session_date,
            start_time=start_time,
            duration_minutes=duration,
            status="booked"
        )
        db.session.add(new_session)
        db.session.commit()
        flash("Session created successfully!")
        return redirect(url_for('session_list'))
    students = Student.query.all()
    tutors = Tutor.query.all()
    return render_template("session_create.html", students=students, tutors=tutors)

# 课时列表页面
@app.route('/sessions')
def session_list():
    sessions = Session.query.all()
    return render_template("session_list.html", sessions=sessions)

# 取消课时（修改状态，不删除）
@app.route('/session/<int:session_id>/cancel', methods=['POST'])
def session_cancel(session_id):
    s = Session.query.get_or_404(session_id)
    s.status = "cancelled"
    db.session.commit()
    flash("Session cancelled.")
    return redirect(url_for('session_list'))
