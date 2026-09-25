# Requirements and acceptance criteria

## Scope

Redgum Tutoring needs a reliable way to maintain people records, record tutor availability, schedule tutoring sessions, avoid clashes and review session history. The MVP is deliberately small enough to demonstrate these workflows without collecting real student information.

## Functional requirements

### Student records — MSD426GXUST17-3

**User story:** As centre staff, I want to maintain student records so that bookings use current contact details.

**Acceptance criteria**

- Staff can add a student with name and valid email.
- Staff can edit an existing student's contact details.
- The student list shows the number of recorded sessions.
- A student's session-history action opens their past and future sessions.

### Tutor availability — MSD426GXUST17-4

**User story:** As centre staff, I want to record tutor availability so that sessions are offered only at valid times.

**Acceptance criteria**

- Staff can record a weekday, start time and end time for a tutor.
- End time must be later than start time.
- Multiple weekly availability windows can be retained for a tutor.
- Availability is visible before a session is saved.

### Session booking — MSD426GXUST17-5

**User story:** As centre staff, I want to book a student with a tutor so that the appointment appears on the centre schedule.

**Acceptance criteria**

- A booking requires a valid student, tutor, date, time and duration.
- A valid booking is stored and appears in the schedule.
- The booking includes optional preparation notes.
- The selected tutor's weekly availability is displayed in the booking form.

### Availability and clash validation — MSD426GXUST17-6

**User story:** As centre staff, I want bookings validated automatically so that tutors are not double-booked or scheduled outside their hours.

**Acceptance criteria**

- A booking outside every matching tutor availability window is rejected.
- A booking that overlaps another active session for the same tutor is rejected.
- Adjacent, non-overlapping sessions are accepted.
- A cancelled session does not block its former time.

### Tutor records — MSD426GXUST17-7

**User story:** As centre staff, I want to maintain tutor details and subjects so that an appropriate tutor can be selected.

**Acceptance criteria**

- Staff can add a tutor with name, valid email and at least one subject.
- Staff can edit tutor details.
- Subjects and weekly availability are visible on the tutor list.

### Move a session — MSD426GXUST17-8

**User story:** As centre staff, I want to move a booking so that changes are recorded without creating a duplicate.

**Acceptance criteria**

- Staff can change date, time, tutor, student or duration on an existing session.
- The edited booking is checked against availability and conflicts.
- The session keeps its original identity after a successful move.

### Cancel a session — MSD426GXUST17-9

**User story:** As centre staff, I want to cancel a booking so that the record remains visible while the time becomes available.

**Acceptance criteria**

- Staff can set a session to Cancelled.
- Cancelled sessions remain in the history.
- Cancelled sessions no longer block new bookings.

### Attendance — MSD426GXUST17-10

**User story:** As centre staff, I want to record attendance so that session outcomes are traceable.

**Acceptance criteria**

- A session can be marked Scheduled, Attended, No-show or Cancelled.
- The updated status appears immediately in the schedule.
- The dashboard reports the number of attended sessions.

### Daily and weekly schedule — MSD426GXUST17-11

**User story:** As centre staff, I want daily and weekly schedule views so that workload is easy to coordinate.

**Acceptance criteria**

- Staff can view all sessions.
- Staff can select a reference date and show that day only.
- Staff can select a reference date and show its Monday-to-Sunday week.
- Results are ordered by date and start time.

### Tutor upcoming sessions — MSD426GXUST17-12

**User story:** As a tutor, I want to view my upcoming sessions so that I can prepare.

**Acceptance criteria**

- Choosing a tutor filters the session list to that tutor.
- Each result shows student, date, time, duration and status.

### Student session history — MSD426GXUST17-13

**User story:** As a student, I want to view my past and future sessions so that I understand my tutoring history.

**Acceptance criteria**

- Choosing a student filters the session list to that student.
- Both past and future records remain visible.
- Cancelled sessions remain identifiable in the history.

## Non-functional requirements

- The interface must work on desktop and mobile widths.
- Forms must use labels, keyboard-accessible controls and meaningful status feedback.
- Validation rules must be separated from UI code and covered by automated tests.
- A clean checkout must run with Node.js and no external packages.
- The prototype must not contain real student information, passwords, API keys or other secrets.
