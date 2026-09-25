export const ATTENDANCE_STATUSES = ["Scheduled", "Attended", "No-show", "Cancelled"];

export function minutes(time) {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
}

export function endMinutes(session) {
  return minutes(session.startTime) + Number(session.duration);
}

export function dayName(date) {
  return new Intl.DateTimeFormat("en-AU", { weekday: "long", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

export function isWithinAvailability(tutor, session) {
  const start = minutes(session.startTime);
  const end = endMinutes(session);
  const weekday = dayName(session.date);
  return tutor.availability.some((window) => (
    window.day === weekday && start >= minutes(window.start) && end <= minutes(window.end)
  ));
}

export function sessionsOverlap(first, second) {
  if (first.date !== second.date || first.tutorId !== second.tutorId) return false;
  return minutes(first.startTime) < endMinutes(second) && minutes(second.startTime) < endMinutes(first);
}

export function validateSession(session, data, editingId = null) {
  const errors = [];
  const student = data.students.find((item) => item.id === session.studentId);
  const tutor = data.tutors.find((item) => item.id === session.tutorId);

  if (!student) errors.push("Select a valid student.");
  if (!tutor) errors.push("Select a valid tutor.");
  if (!session.date) errors.push("Choose a session date.");
  if (!session.startTime) errors.push("Choose a start time.");
  if (!Number.isFinite(Number(session.duration)) || Number(session.duration) < 15) {
    errors.push("Duration must be at least 15 minutes.");
  }

  if (tutor && session.date && session.startTime && Number(session.duration) >= 15) {
    if (!isWithinAvailability(tutor, session)) {
      errors.push("The session falls outside the tutor's availability.");
    }
    const conflict = data.sessions.find((item) => (
      item.id !== editingId && item.status !== "Cancelled" && sessionsOverlap(item, session)
    ));
    if (conflict) errors.push("The tutor already has a session at this time.");
  }

  return errors;
}

export function startOfWeek(value) {
  const date = new Date(`${value}T00:00:00`);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

export function inSameWeek(date, reference) {
  return startOfWeek(date) === startOfWeek(reference);
}

export function sortSessions(sessions) {
  return [...sessions].sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`));
}

export function newId(prefix, collection) {
  const values = collection
    .map((item) => Number(String(item.id).replace(/\D/g, "")))
    .filter(Number.isFinite);
  return `${prefix}${Math.max(0, ...values) + 1}`;
}

export function createDemoData() {
  return {
    students: [
      { id: "S1", name: "Mia Chen", email: "mia@example.test", phone: "0400 100 101" },
      { id: "S2", name: "Noah Williams", email: "noah@example.test", phone: "0400 100 102" }
    ],
    tutors: [
      {
        id: "T1",
        name: "Ava Patel",
        email: "ava@example.test",
        subjects: ["Mathematics", "Physics"],
        availability: [
          { day: "Monday", start: "09:00", end: "17:00" },
          { day: "Wednesday", start: "09:00", end: "17:00" },
          { day: "Friday", start: "09:00", end: "17:00" }
        ]
      },
      {
        id: "T2",
        name: "Leo Brown",
        email: "leo@example.test",
        subjects: ["English", "History"],
        availability: [
          { day: "Tuesday", start: "10:00", end: "18:00" },
          { day: "Thursday", start: "10:00", end: "18:00" }
        ]
      }
    ],
    sessions: []
  };
}
