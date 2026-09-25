import test from "node:test";
import assert from "node:assert/strict";
import {
  createDemoData,
  inSameWeek,
  isWithinAvailability,
  sessionsOverlap,
  validateSession
} from "../src/model.js";

function validSession(overrides = {}) {
  return {
    id: "B1",
    studentId: "S1",
    tutorId: "T1",
    date: "2026-09-28",
    startTime: "10:00",
    duration: 60,
    status: "Scheduled",
    notes: "",
    ...overrides
  };
}

test("accepts a session inside tutor availability", () => {
  const data = createDemoData();
  assert.equal(isWithinAvailability(data.tutors[0], validSession()), true);
  assert.deepEqual(validateSession(validSession(), data), []);
});

test("rejects a session outside tutor availability", () => {
  const data = createDemoData();
  const errors = validateSession(validSession({ startTime: "18:00" }), data);
  assert.ok(errors.some((error) => error.includes("outside")));
});

test("rejects overlapping active sessions for the same tutor", () => {
  const data = createDemoData();
  data.sessions.push(validSession());
  const next = validSession({ id: "B2", startTime: "10:30" });
  assert.equal(sessionsOverlap(data.sessions[0], next), true);
  assert.ok(validateSession(next, data).some((error) => error.includes("already")));
});

test("cancelled sessions do not block a new booking", () => {
  const data = createDemoData();
  data.sessions.push(validSession({ status: "Cancelled" }));
  assert.deepEqual(validateSession(validSession({ id: "B2" }), data), []);
});

test("editing a session does not conflict with itself", () => {
  const data = createDemoData();
  const session = validSession();
  data.sessions.push(session);
  assert.deepEqual(validateSession(session, data, session.id), []);
});

test("identifies dates in the same Monday-to-Sunday week", () => {
  assert.equal(inSameWeek("2026-09-28", "2026-10-04"), true);
  assert.equal(inSameWeek("2026-09-28", "2026-10-05"), false);
});
