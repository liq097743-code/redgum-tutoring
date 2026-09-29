from flask import Flask, render_template, request, redirect, url_for, flash
from models import db
import os
from datetime import date, timedelta, datetime, time

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///redgum.db'
app.config['SECRET_KEY'] = 'devkey123'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

# 首页
@app.route('/')
def index():
    return "Redgum Tutoring System"

# 新建课时表单页面（加入时间校验）
@app.route('/session/new', methods=['GET','POST'])
def session_new():
    from models import Student, Tutor, Session, TutorAvailability
    if request.method == 'POST':
        student_id = request.form['student_id']
        tutor_id = int(request.form['tutor_id'])
        session_date = date.fromisoformat(request.form['session_date'])
        start_time_str = request.form['start_time']
        start_time = datetime.strptime(start_time_str, "%H:%M").time()
        duration = int(request.form['duration_minutes'])

        # ============【新增：教师可用时间校验逻辑】============
        weekday_num = session_date.weekday()
        avail = TutorAvailability.query.filter_by(tutor_id=tutor_id, weekday=weekday_num).first()
        valid = False
        if avail:
            start_dt = datetime(2000,1,1, start_time.hour, start_time.minute)
            end_dt = start_dt + timedelta(minutes=duration)
            end_time = end_dt.time()
            if start_time >= avail.start_time and end_time <= avail.end_time:
                valid = True

        if not valid:
            flash("Error: Selected time is outside tutor's available hours!")
            return redirect(url_for('session_new'))
        # ======================================================

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

# ============【新增路由1：教师个人课时列表】============
@app.route('/tutor/<int:tutor_id>/sessions')
def tutor_sessions(tutor_id):
    sessions = Session.query.filter_by(tutor_id=tutor_id).all()
    return render_template("tutor_session_list.html", sessions=sessions)

# ============【新增路由2：单日课表视图】============
@app.route('/daily-schedule')
def daily_schedule():
    target_date = request.args.get('date', date.today().isoformat())
    target_date_obj = date.fromisoformat(target_date)
    sessions = Session.query.filter_by(session_date=target_date_obj).all()
    return render_template("daily_schedule.html", sessions=sessions, selected_date=target_date_obj)

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from models import db
from routes import student_bp
from routes import tutor_bp

# 初始化Flask应用
app = Flask(__name__)
# SQLite数据库文件
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tutoring.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "dev-secret-key"

db.init_app(app)

# 注册蓝图（学生模块 + 教师模块，两个都保留！）
app.register_blueprint(student_bp)
app.register_blueprint(tutor_bp)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
