import pytest
from app import app, db
from models import Student, Tutor, TutorAvailability, Session
from datetime import date, time

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            # 准备测试数据
            tutor = Tutor(name="Test Tutor", subject="Math")
            student = Student(name="Test Student")
            db.session.add_all([tutor, student])
            db.session.commit()

            # 设置老师周一(weekday=0)可用：10:00 ~ 12:00
            avail = TutorAvailability(
                tutor_id = tutor.id,
                weekday = 0,
                start_time = time(10,0),
                end_time = time(12,0)
            )
            db.session.add(avail)
            db.session.commit()
            yield client
            db.session.remove()
            db.drop_all()

def test_valid_booking(client):
    # 正常预约：10:00开始，60分钟，在10:00-12:00区间内
    resp = client.post('/session/new', data={
        "student_id": 1,
        "tutor_id":1,
        "session_date": "2026-09-29", # 周一
        "start_time": "10:00",
        "duration_minutes":60
    }, follow_redirects=True)
    # 数据库里应该成功创建Session
    sess = Session.query.first()
    assert sess is not None

def test_invalid_booking_outside_hours(client):
    # 错误预约：12:30开始，超出老师可用时间（最晚12:00）
    resp = client.post('/session/new', data={
        "student_id": 1,
        "tutor_id":1,
        "session_date": "2026-09-29", # 周一
        "start_time": "12:30",
        "duration_minutes":30
    }, follow_redirects=True)
    # 不应该生成新session
    sess_count = Session.query.count()
    assert sess_count == 0
