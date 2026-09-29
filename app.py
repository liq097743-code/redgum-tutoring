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
