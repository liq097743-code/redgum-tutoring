import {
  ATTENDANCE_STATUSES,
  createDemoData,
  inSameWeek,
  newId,
  sortSessions,
  validateSession
} from "./model.js";

const STORAGE_KEY = "redgum-tutoring-v1";
const app = document.querySelector("#app");
const studentDialog = document.querySelector("#student-dialog");
const tutorDialog = document.querySelector("#tutor-dialog");
const sessionDialog = document.querySelector("#session-dialog");
const studentForm = document.querySelector("#student-form");
const tutorForm = document.querySelector("#tutor-form");
const sessionForm = document.querySelector("#session-form");

let data = loadData();
let filters = { query: "", date: "", scope: "all", person: "" };

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : createDemoData();
  } catch {
    return createDemoData();
  }
}

function saveData(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (message) toast(message);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`)) : "—";
}

function byId(collection, id) {
  return collection.find((item) => item.id === id);
}

function toast(message) {
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.classList.add("visible");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => element.classList.remove("visible"), 2500);
}

function activeRoute() {
  return ["students", "tutors", "sessions"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "dashboard";
}

function pageHeader(title, subtitle, action = "") {
  return `<section class="hero"><div><span class="eyebrow">Redgum Tutoring</span><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>${action}</section>`;
}

function sessionRow(session) {
  const student = byId(data.students, session.studentId);
  const tutor = byId(data.tutors, session.tutorId);
  const statusClass = session.status.toLowerCase().replace("-", "-");
  return `<tr>
    <td><strong>${formatDate(session.date)}</strong><small>${escapeHtml(session.startTime)} · ${session.duration} min</small></td>
    <td><strong>${escapeHtml(student?.name || "Unknown student")}</strong><small>${escapeHtml(student?.email || "")}</small></td>
    <td><strong>${escapeHtml(tutor?.name || "Unknown tutor")}</strong><small>${escapeHtml((tutor?.subjects || []).join(", "))}</small></td>
    <td><span class="badge ${statusClass}">${escapeHtml(session.status)}</span></td>
    <td><select class="status-select" data-id="${session.id}" aria-label="Attendance status for ${escapeHtml(student?.name || "session")}">
      ${ATTENDANCE_STATUSES.map((status) => `<option ${status === session.status ? "selected" : ""}>${status}</option>`).join("")}
    </select></td>
    <td><div class="actions"><button class="button secondary small" data-action="edit-session" data-id="${session.id}">Move / edit</button>${session.status !== "Cancelled" ? `<button class="button danger small" data-action="cancel-session" data-id="${session.id}">Cancel</button>` : ""}</div></td>
  </tr>`;
}

function sessionsTable(sessions) {
  if (!sessions.length) return `<div class="empty">No sessions match this view. Book a session to begin.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Date & time</th><th>Student</th><th>Tutor</th><th>Status</th><th>Attendance</th><th></th></tr></thead><tbody>${sessions.map(sessionRow).join("")}</tbody></table></div>`;
}

function renderDashboard() {
  const upcoming = sortSessions(data.sessions).filter((session) => session.date >= today() && session.status === "Scheduled").slice(0, 5);
  const todaySessions = data.sessions.filter((session) => session.date === today() && session.status !== "Cancelled").length;
  const attended = data.sessions.filter((session) => session.status === "Attended").length;
  app.innerHTML = `${pageHeader("A clear view of every tutoring day", "Plan sessions within tutor availability, track attendance, and keep student and tutor records in one dependable place.", `<button class="button primary" data-action="new-session">Book a session</button>`)}
    <section class="stats" aria-label="Centre summary">
      <article class="stat"><span class="value">${data.students.length}</span><span class="label">Active students</span></article>
      <article class="stat"><span class="value">${data.tutors.length}</span><span class="label">Tutors</span></article>
      <article class="stat"><span class="value">${todaySessions}</span><span class="label">Sessions today</span></article>
      <article class="stat"><span class="value">${attended}</span><span class="label">Attendance recorded</span></article>
    </section>
    <section class="grid">
      <article class="card"><div class="card-heading"><h2>Upcoming sessions</h2><a href="#sessions">View schedule</a></div>${sessionsTable(upcoming)}</article>
      <aside class="card"><div class="card-heading"><h2>Scheduling checks</h2></div><div class="callout">Every booking is checked against the selected tutor's weekly availability and existing active sessions. Cancelled sessions release the time automatically.</div></aside>
    </section>`;
}

function renderStudents() {
  app.innerHTML = `${pageHeader("Student records", "Maintain accurate contact details and open a student's past and future session history.", `<button class="button primary" data-action="new-student">Add student</button>`)}
    <section class="card"><div class="person-list">${data.students.length ? data.students.map((student) => {
      const sessions = data.sessions.filter((session) => session.studentId === student.id);
      return `<article class="person"><div><strong>${escapeHtml(student.name)}</strong><p>${escapeHtml(student.email)}${student.phone ? ` · ${escapeHtml(student.phone)}` : ""}</p><p>${sessions.length} session${sessions.length === 1 ? "" : "s"} recorded</p></div><div class="actions"><button class="button secondary small" data-action="student-sessions" data-id="${student.id}">Session history</button><button class="button secondary small" data-action="edit-student" data-id="${student.id}">Edit</button></div></article>`;
    }).join("") : `<div class="empty">No student records yet.</div>`}</div></section>`;
}

function renderTutors() {
  app.innerHTML = `${pageHeader("Tutors & availability", "Keep subject expertise and weekly teaching windows visible before a booking is made.", `<button class="button primary" data-action="new-tutor">Add tutor</button>`)}
    <section class="card"><div class="person-list">${data.tutors.length ? data.tutors.map((tutor) => `<article class="person"><div><strong>${escapeHtml(tutor.name)}</strong><p>${escapeHtml(tutor.email)} · ${escapeHtml(tutor.subjects.join(", "))}</p><div class="window-list">${tutor.availability.map((window) => `<span class="window">${window.day.slice(0,3)} ${window.start}–${window.end}</span>`).join("")}</div></div><div class="actions"><button class="button secondary small" data-action="tutor-sessions" data-id="${tutor.id}">Upcoming</button><button class="button secondary small" data-action="edit-tutor" data-id="${tutor.id}">Edit / add hours</button></div></article>`).join("") : `<div class="empty">No tutor records yet.</div>`}</div></section>`;
}

function filteredSessions() {
  const reference = filters.date || today();
  return sortSessions(data.sessions).filter((session) => {
    const student = byId(data.students, session.studentId);
    const tutor = byId(data.tutors, session.tutorId);
    const text = `${student?.name || ""} ${tutor?.name || ""} ${session.notes || ""}`.toLowerCase();
    const matchesQuery = text.includes(filters.query.toLowerCase());
    const matchesPerson = !filters.person || session.studentId === filters.person || session.tutorId === filters.person;
    const matchesDate = filters.scope === "day" ? session.date === reference : filters.scope === "week" ? inSameWeek(session.date, reference) : true;
    return matchesQuery && matchesPerson && matchesDate;
  });
}

function renderSessions() {
  const people = [
    ...data.students.map((student) => ({ id: student.id, label: `Student: ${student.name}` })),
    ...data.tutors.map((tutor) => ({ id: tutor.id, label: `Tutor: ${tutor.name}` }))
  ];
  app.innerHTML = `${pageHeader("Session schedule", "Use daily or weekly views, move bookings safely, cancel sessions, and record attendance.", `<button class="button primary" data-action="new-session">Book a session</button>`)}
    <section class="card"><div class="toolbar"><div class="filters">
      <input id="session-search" type="search" placeholder="Search student or tutor" value="${escapeHtml(filters.query)}" aria-label="Search sessions">
      <select id="scope-filter" aria-label="Schedule scope"><option value="all" ${filters.scope === "all" ? "selected" : ""}>All dates</option><option value="day" ${filters.scope === "day" ? "selected" : ""}>One day</option><option value="week" ${filters.scope === "week" ? "selected" : ""}>One week</option></select>
      <input id="date-filter" type="date" value="${filters.date || today()}" aria-label="Reference date">
      <select id="person-filter" aria-label="Filter by student or tutor"><option value="">All people</option>${people.map((person) => `<option value="${person.id}" ${filters.person === person.id ? "selected" : ""}>${escapeHtml(person.label)}</option>`).join("")}</select>
    </div><button class="button secondary" data-action="reset-demo">Reset demo data</button></div>${sessionsTable(filteredSessions())}</section>`;
}

function render() {
  const route = activeRoute();
  document.querySelectorAll("[data-route]").forEach((link) => link.classList.toggle("active", link.dataset.route === route));
  ({ dashboard: renderDashboard, students: renderStudents, tutors: renderTutors, sessions: renderSessions })[route]();
  bindPageEvents();
  app.focus({ preventScroll: true });
}

function openStudent(id = "") {
  const student = byId(data.students, id);
  studentForm.reset();
  studentForm.elements.id.value = student?.id || "";
  studentForm.elements.name.value = student?.name || "";
  studentForm.elements.email.value = student?.email || "";
  studentForm.elements.phone.value = student?.phone || "";
  studentForm.querySelector(".form-error").textContent = "";
  document.querySelector("#student-dialog-title").textContent = student ? "Edit student" : "Add student";
  studentDialog.showModal();
}

function openTutor(id = "") {
  const tutor = byId(data.tutors, id);
  tutorForm.reset();
  tutorForm.elements.id.value = tutor?.id || "";
  tutorForm.elements.name.value = tutor?.name || "";
  tutorForm.elements.email.value = tutor?.email || "";
  tutorForm.elements.subjects.value = tutor?.subjects.join(", ") || "";
  tutorForm.elements.start.value = "09:00";
  tutorForm.elements.end.value = "17:00";
  tutorForm.querySelector(".form-error").textContent = "";
  document.querySelector("#tutor-dialog-title").textContent = tutor ? "Edit tutor / add availability" : "Add tutor";
  tutorDialog.showModal();
}

function sessionOptions() {
  sessionForm.elements.studentId.innerHTML = `<option value="">Choose a student</option>${data.students.map((student) => `<option value="${student.id}">${escapeHtml(student.name)}</option>`).join("")}`;
  sessionForm.elements.tutorId.innerHTML = `<option value="">Choose a tutor</option>${data.tutors.map((tutor) => `<option value="${tutor.id}">${escapeHtml(tutor.name)} — ${escapeHtml(tutor.subjects.join(", "))}</option>`).join("")}`;
}

function updateAvailabilityNote() {
  const tutor = byId(data.tutors, sessionForm.elements.tutorId.value);
  document.querySelector("#availability-note").textContent = tutor
    ? `${tutor.name}: ${tutor.availability.map((window) => `${window.day} ${window.start}–${window.end}`).join("; ")}`
    : "Select a tutor to view weekly availability.";
}

function openSession(id = "") {
  const session = byId(data.sessions, id);
  sessionForm.reset();
  sessionOptions();
  sessionForm.elements.id.value = session?.id || "";
  sessionForm.elements.studentId.value = session?.studentId || "";
  sessionForm.elements.tutorId.value = session?.tutorId || "";
  sessionForm.elements.date.value = session?.date || today();
  sessionForm.elements.startTime.value = session?.startTime || "10:00";
  sessionForm.elements.duration.value = String(session?.duration || 60);
  sessionForm.elements.status.value = session?.status || "Scheduled";
  sessionForm.elements.notes.value = session?.notes || "";
  sessionForm.querySelector(".form-error").textContent = "";
  document.querySelector("#session-dialog-title").textContent = session ? "Move or edit session" : "Book session";
  updateAvailabilityNote();
  sessionDialog.showModal();
}

function bindPageEvents() {
  app.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
    const { action, id } = button.dataset;
    if (action === "new-student") openStudent();
    if (action === "edit-student") openStudent(id);
    if (action === "new-tutor") openTutor();
    if (action === "edit-tutor") openTutor(id);
    if (action === "new-session") openSession();
    if (action === "edit-session") openSession(id);
    if (action === "student-sessions" || action === "tutor-sessions") {
      filters.person = id; filters.scope = "all"; location.hash = "sessions"; render();
    }
    if (action === "cancel-session") {
      const session = byId(data.sessions, id);
      if (session) { session.status = "Cancelled"; saveData("Session cancelled and time released."); render(); }
    }
    if (action === "reset-demo" && window.confirm("Reset all local records to the original demo data?")) {
      data = createDemoData(); saveData("Demo data restored."); render();
    }
  }));

  app.querySelectorAll(".status-select").forEach((select) => select.addEventListener("change", () => {
    const session = byId(data.sessions, select.dataset.id);
    if (session) { session.status = select.value; saveData("Attendance status updated."); render(); }
  }));

  const search = document.querySelector("#session-search");
  if (search) search.addEventListener("input", () => { filters.query = search.value; renderSessions(); bindPageEvents(); });
  const scope = document.querySelector("#scope-filter");
  if (scope) scope.addEventListener("change", () => { filters.scope = scope.value; renderSessions(); bindPageEvents(); });
  const date = document.querySelector("#date-filter");
  if (date) date.addEventListener("change", () => { filters.date = date.value; renderSessions(); bindPageEvents(); });
  const person = document.querySelector("#person-filter");
  if (person) person.addEventListener("change", () => { filters.person = person.value; renderSessions(); bindPageEvents(); });
}

studentForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "save") return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(studentForm));
  if (!studentForm.reportValidity()) return;
  const record = { id: values.id || newId("S", data.students), name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() };
  const existing = data.students.findIndex((item) => item.id === record.id);
  if (existing >= 0) data.students[existing] = record; else data.students.push(record);
  saveData(existing >= 0 ? "Student updated." : "Student added.");
  studentDialog.close(); render();
});

tutorForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "save") return;
  event.preventDefault();
  if (!tutorForm.reportValidity()) return;
  const values = Object.fromEntries(new FormData(tutorForm));
  if (values.start >= values.end) {
    tutorForm.querySelector(".form-error").textContent = "Availability end time must be after the start time.";
    return;
  }
  const previous = byId(data.tutors, values.id);
  const window = { day: values.day, start: values.start, end: values.end };
  const availability = previous ? [...previous.availability] : [];
  if (!availability.some((item) => item.day === window.day && item.start === window.start && item.end === window.end)) availability.push(window);
  const record = { id: values.id || newId("T", data.tutors), name: values.name.trim(), email: values.email.trim(), subjects: values.subjects.split(",").map((item) => item.trim()).filter(Boolean), availability };
  const existing = data.tutors.findIndex((item) => item.id === record.id);
  if (existing >= 0) data.tutors[existing] = record; else data.tutors.push(record);
  saveData(existing >= 0 ? "Tutor and availability updated." : "Tutor added.");
  tutorDialog.close(); render();
});

sessionForm.elements.tutorId.addEventListener("change", updateAvailabilityNote);
sessionForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "save") return;
  event.preventDefault();
  if (!sessionForm.reportValidity()) return;
  const values = Object.fromEntries(new FormData(sessionForm));
  const record = { id: values.id || newId("B", data.sessions), studentId: values.studentId, tutorId: values.tutorId, date: values.date, startTime: values.startTime, duration: Number(values.duration), status: values.status, notes: values.notes.trim() };
  const errors = validateSession(record, data, values.id || null);
  if (errors.length) {
    sessionForm.querySelector(".form-error").innerHTML = errors.map(escapeHtml).join("<br>");
    return;
  }
  const existing = data.sessions.findIndex((item) => item.id === record.id);
  if (existing >= 0) data.sessions[existing] = record; else data.sessions.push(record);
  saveData(existing >= 0 ? "Session updated." : "Session booked.");
  sessionDialog.close(); location.hash = "sessions"; render();
});

window.addEventListener("hashchange", render);
render();
