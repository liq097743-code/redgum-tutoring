from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.String(50), nullable=False)
    family_contact = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f"<Student {self.full_name}>"
