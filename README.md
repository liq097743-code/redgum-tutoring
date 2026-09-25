# Redgum Tutoring

A lightweight scheduling and session-record system for a tutoring centre. The project is the implementation for **ISYS3001 Case 3 – Redgum Tutoring** and is designed to demonstrate a clear software-development workflow across Jira, Confluence and GitHub.

## Features

- Maintain student contact records.
- Maintain tutor records, subjects and weekly availability windows.
- Book a student with a tutor only inside the tutor's availability.
- Prevent overlapping active bookings for the same tutor.
- Move, edit or cancel a booked session.
- Record attendance as Scheduled, Attended, No-show or Cancelled.
- View all sessions or filter by day, week, tutor or student.
- View a tutor's upcoming sessions and a student's complete session history.
- Store prototype data locally in the browser; no account or database setup is required.

## Quick start

Requirements: [Node.js](https://nodejs.org/) 20 or newer.

```bash
git clone https://github.com/liq097743-code/redgum-tutoring.git
cd redgum-tutoring
npm start
```

Open <http://localhost:3000>. The application starts with two example students and two example tutors. Data is saved in the current browser's `localStorage`.

## Run the tests

```bash
npm test
```

The automated tests cover tutor availability, overlapping bookings, cancellation, editing and weekly schedule boundaries. No package installation is needed because the project uses the Node.js standard library.

## Project structure

```text
.
├── index.html             Application shell and accessible dialogs
├── styles.css             Responsive visual design
├── server.js              Dependency-free local web server
├── src/
│   ├── app.js             User interface and local persistence
│   └── model.js           Scheduling rules and validation
├── tests/
│   └── model.test.js      Automated business-rule tests
└── docs/                  Requirements, sprint and test documentation
```

## Jira work-item mapping

| Jira key | Implemented capability |
|---|---|
| MSD426GXUST17-3 | Manage student records |
| MSD426GXUST17-4 | Manage tutor availability windows |
| MSD426GXUST17-5 | Book a tutoring session |
| MSD426GXUST17-6 | Validate a session against tutor availability |
| MSD426GXUST17-7 | Manage tutor records |
| MSD426GXUST17-8 | Move a booked session |
| MSD426GXUST17-9 | Cancel a booked session |
| MSD426GXUST17-10 | Record session attendance status |
| MSD426GXUST17-11 | View the centre's daily and weekly schedule |
| MSD426GXUST17-12 | Tutor views upcoming sessions |
| MSD426GXUST17-13 | Student views past and future sessions |
| MSD426GXUST17-14 | Automated scheduling-rule tests |
| MSD426GXUST17-15 | Clean-checkout setup and usage instructions |

## Working agreement

1. Select a Jira work item before starting work.
2. Create a branch named `feature/JIRA-KEY-short-description`.
3. Keep commits small and include the Jira key, for example `MSD426GXUST17-5 Add booking validation`.
4. Open a pull request, run `npm test`, and request review from another team member.
5. Merge only when the acceptance criteria are satisfied and the Jira item can move to Done.

Additional members are intentionally left unassigned until they join the project. Do not invent member names or contribution records.

## Prototype limitations

This assessment MVP uses browser-local data and has no authentication or shared production database. A production release would add role-based access, server-side validation, persistent storage, audit logging, backups and privacy controls.

## Documentation

- [Requirements and acceptance criteria](docs/REQUIREMENTS.md)
- [Sprint plan](docs/SPRINT_PLAN.md)
- [Test plan](docs/TEST_PLAN.md)
- [Confluence page source](docs/CONFLUENCE_PROJECT_PAGE.md)

## Academic integrity and AI use

The team must review all generated material, understand the code, keep individual work attributable through commits and pull requests, and include any AI-use declaration required by Southern Cross University and the unit assessment instructions.
