import unittest
from app import app, db
from models import Tutor, Availability

class TutorModuleTestCase(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.client = app.test_client()
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    # 测试教师软删除停用逻辑
    def test_tutor_soft_deactivate(self):
        with app.app_context():
            t = Tutor(name="Test Teacher", subject="Math", is_active=True)
            db.session.add(t)
            db.session.commit()
            # 执行停用
            t.is_active = False
            db.session.commit()
            found = Tutor.query.get(t.id)
            self.assertEqual(found.is_active, False)
            self.assertIsNotNone(found) # 记录不被删除

    # 测试新增可用时间窗口
    def test_add_availability(self):
        with app.app_context():
            t = Tutor(name="Alice", subject="English", is_active=True)
            db.session.add(t)
            db.session.commit()
            avail = Availability(tutor_id=t.id, weekday="2", start_time="09:00", end_time="17:00")
            db.session.add(avail)
            db.session.commit()
            self.assertEqual(len(t.availabilities), 1)

    # 测试删除可用时间窗口
    def test_delete_availability(self):
        with app.app_context():
            t = Tutor(name="Bob", subject="Physics", is_active=True)
            db.session.add(t)
            db.session.commit()
            avail = Availability(tutor_id=t.id, weekday="3", start_time="10:00", end_time="14:00")
            db.session.add(avail)
            db.session.commit()
            db.session.delete(avail)
            db.session.commit()
            self.assertEqual(len(t.availabilities), 0)

if __name__ == "__main__":
    unittest.main()
