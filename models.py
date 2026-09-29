from flask_sqlalchemy import SQLAlchemy
from datetime import time

db = SQLAlchemy()

# 成员1后续会写Student模型
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.String(20))
    contact = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)

# 成员2后续会写Tutor、TutorAvailability模型
class Tutor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)

class TutorAvailability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tutor_id = db.Column(db.Integer, db.ForeignKey('tutor.id'), nullable=False)
    weekday = db.Column(db.Integer) # 0=周一,6=周日
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)

# ========== 这是你【成员3的Session模型】==========
class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    tutor_id = db.Column(db.Integer, db.ForeignKey('tutor.id'), nullable=False)
    session_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default="booked") # booked / attended / cancelled / missed

    # 计算课时结束时间，用于你的时间校验逻辑
    def get_end_time(self):
        from datetime import datetime, timedelta
        dummy_date = datetime(2000,1,1,self.start_time.hour, self.start_time.minute)
        end_dt = dummy_date + timedelta(minutes=self.duration_minutes)
        return time(end_dt.hour, end_dt.minute)
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 教师模块模型（main分支原有）
class Tutor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    availabilities = db.relationship('Availability', backref='tutor', lazy=True)

class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tutor_id = db.Column(db.Integer, db.ForeignKey('tutor.id'), nullable=False)
    day = db.Column(db.String(20), nullable=False)
    start_time = db.Column(db.String(20), nullable=False)
    end_time = db.Column(db.String(20), nullable=False)

# 学生模块模型（学生分支新增）
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
