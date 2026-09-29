import pytest
from models import db, Student

def test_create_student(client):
    resp = client.post("/student/create", data={
        "full_name":"Tom",
        "grade":"Year10",
        "family_contact":"TomParent@email.com"
    }, follow_redirects=True)
    assert Student.query.filter_by(full_name="Tom").first() is not None

def test_required_field_validation(client):
    resp = client.post("/student/create", data={
        "full_name":"",
        "grade":"Year10",
        "family_contact":"xxx@xx.com"
    })
    assert Student.query.filter_by(grade="Year10").first() is None

def test_edit_student(client):
    s = Student(full_name="Alice", grade="Y9", family_contact="alice@test.com")
    db.session.add(s)
    db.session.commit()
    resp = client.post(f"/student/edit/{s.id}", data={
        "full_name":"Alice Updated",
        "grade":"Y10",
        "family_contact":"new@test.com"
    }, follow_redirects=True)
    updated = Student.query.get(s.id)
    assert updated.full_name == "Alice Updated"

def test_deactivate_student(client):
    s = Student(full_name="Bob", grade="Y8", family_contact="bob@test.com")
    db.session.add(s)
    db.session.commit()
    client.post(f"/student/deactivate/{s.id}")
    assert Student.query.get(s.id).is_active == False
