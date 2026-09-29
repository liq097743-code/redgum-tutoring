import pytest
from app import app, db
from models import Tutor, Availability, Student

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

# ========== 教师模块测试 ==========
def test_tutor_create(client):
    tutor = Tutor(name="Alice", email="alice@test.com")
    db.session.add(tutor)
    db.session.commit()
    assert Tutor.query.count() == 1

def test_tutor_soft_delete(client):
    tutor = Tutor(name="Bob", email="bob@test.com")
    db.session.add(tutor)
    db.session.commit()
    tutor.is_active = False
    db.session.commit()
    assert Tutor.query.get(1).is_active == False

# ========== 学生模块测试 ==========
def test_student_create(client):
    student = Student(name="Tom", email="tom@test.com")
    db.session.add(student)
    db.session.commit()
    assert Student.query.count() == 1

def test_student_edit(client):
    student = Student(name="Tom", email="tom@test.com")
    db.session.add(student)
    db.session.commit()
    student.name = "Tommy"
    db.session.commit()
    assert Student.query.get(1).name == "Tommy"
