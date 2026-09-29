from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

# 初始化Flask应用
app = Flask(__name__)
# SQLite数据库文件
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///redgum_tutoring.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# 从本地models导入数据模型（你已经写好Tutor、Availability）
from models import Tutor, Availability

# 创建全部数据库表，仅第一次生效
with app.app_context():
    db.create_all()


# ========== 教师管理路由 ==========
# 教师列表页面
@app.route("/tutors")
def tutor_list():
    tutors = Tutor.query.all()
    return render_template("tutor_list.html", tutors=tutors)


# 新增教师 GET打开表单 / POST提交保存
@app.route("/tutors/new", methods=["GET", "POST"])
def tutor_new():
    if request.method == "POST":
        name = request.form["name"]
        subject = request.form["subject"]
        new_tutor = Tutor(name=name, subject=subject, is_active=True)
        db.session.add(new_tutor)
        db.session.commit()
        return redirect(url_for("tutor_list"))
    return render_template("tutor_form.html")


# 编辑教师
@app.route("/tutors/edit/<int:tutor_id>", methods=["GET", "POST"])
def tutor_edit(tutor_id):
    tutor = Tutor.query.get_or_404(tutor_id)
    if request.method == "POST":
        tutor.name = request.form["name"]
        tutor.subject = request.form["subject"]
        db.session.commit()
        return redirect(url_for("tutor_list"))
    return render_template("tutor_form.html", tutor=tutor)


# 教师【软删除-停用】：不删除记录，设置is_active=False
@app.route("/tutors/deactivate/<int:tutor_id>", methods=["POST"])
def tutor_deactivate(tutor_id):
    tutor = Tutor.query.get_or_404(tutor_id)
    tutor.is_active = False
    db.session.commit()
    return redirect(url_for("tutor_list"))


# ========== 教师可用时间窗口 Availability 路由 ==========
@app.route("/tutors/<int:tutor_id>/availability")
def tutor_availability(tutor_id):
    tutor = Tutor.query.get_or_404(tutor_id)
    return render_template("tutor_availability.html", tutor=tutor)


# 新增可用时段
@app.route("/tutors/<int:tutor_id>/availability/new", methods=["POST"])
def availability_new(tutor_id):
    weekday = request.form["weekday"]
    start_time = request.form["start_time"]
    end_time = request.form["end_time"]
    avail = Availability(
        tutor_id=tutor_id,
        weekday=weekday,
        start_time=start_time,
        end_time=end_time
    )
    db.session.add(avail)
    db.session.commit()
    return redirect(url_for("tutor_availability", tutor_id=tutor_id))


# 删除一条可用时间窗口
@app.route("/availability/delete/<int:avail_id>", methods=["POST"])
def availability_delete(avail_id):
    avail = Availability.query.get_or_404(avail_id)
    tutor_id = avail.tutor_id
    db.session.delete(avail)
    db.session.commit()
    return redirect(url_for("tutor_availability", tutor_id=tutor_id))


if __name__ == "__main__":# review feedback: could add input validation
    app.run(debug=True)
