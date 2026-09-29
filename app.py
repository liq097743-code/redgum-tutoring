from flask import Flask, render_template
from models import db
from routes import student_bp

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tutoring.db"
app.config["SECRET_KEY"] = "dev-secret-key"
db.init_app(app)

app.register_blueprint(student_bp)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
