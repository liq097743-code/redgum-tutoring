from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 教师信息模型
class Tutor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    availabilities = db.relationship('Availability', backref='tutor', lazy=True)

    def __repr__(self):
        return f"<Tutor {self.name}>"

# 教师可用时间模型
class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tutor_id = db.Column(db.Integer, db.ForeignKey('tutor.id'), nullable=False)
    weekday = db.Column(db.String(20), nullable=False)
    start_time = db.Column(db.String(20), nullable=False)
    end_time = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"<Availability tutor_id:{self.tutor_id} {self.weekday} {self.start_time}-{self.end_time}>"
