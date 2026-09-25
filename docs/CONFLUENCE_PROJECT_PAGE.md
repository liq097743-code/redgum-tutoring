# Redgum Tutoring — Project Hub

## Project overview

Redgum Tutoring needs a small scheduling and session-record system. The MVP centralises student and tutor records, weekly tutor availability, booking validation, schedule views and attendance outcomes. The project uses Jira for work tracking, GitHub for version control and this Confluence page for durable project decisions and evidence.

**Current team state:** one repository owner is present; additional members and role allocation are pending. Jira work remains unassigned until real members join.

## Objectives

- Maintain accurate student and tutor records.
- Prevent sessions outside tutor availability or overlapping active bookings.
- Support booking, moving, cancelling and attendance recording.
- Provide daily, weekly, tutor and student views.
- Keep the project runnable and testable from a clean GitHub checkout.

## Scope and constraints

The assessment MVP is a browser application with local storage and fictional demonstration data. It does not provide authentication, shared production storage, billing, notifications or collection of real student data. Those capabilities are future work.

## Product backlog

The Jira project contains two epics, eleven user stories and two technical tasks. Detailed user stories and acceptance criteria are maintained in `docs/REQUIREMENTS.md` in GitHub. Proposed estimates total 46 points and must be reviewed by the real team before the sprint begins.

## Architecture

- `index.html` supplies the application shell and accessible forms.
- `src/app.js` renders views and persists prototype data in browser local storage.
- `src/model.js` contains scheduling rules independent of the interface.
- `server.js` provides a dependency-free local HTTP server.
- `tests/model.test.js` verifies availability, clashes, cancellation, editing and week boundaries.

Separating scheduling rules from the UI keeps the critical business logic testable and prepares the prototype for a later server/database implementation.

## Working agreement

1. Select a Jira item and create a branch named `feature/JIRA-KEY-short-description`.
2. Include the Jira key in commit and pull-request titles.
3. Run `npm test` before requesting review.
4. Keep work items In Progress while work is active and move them to Done only when the Definition of Done is met.
5. Do not commit credentials or real student data.
6. Record actual meeting decisions and actual member contributions only.

## Definition of Done

- Acceptance criteria satisfied.
- Relevant tests passing.
- Keyboard and responsive behaviour checked.
- Documentation updated.
- No secrets or real personal data committed.
- Peer review completed when more than one member is available.

## Risks and responses

| Risk | Response |
|---|---|
| Team members join late | Keep work unassigned and use small, independent stories. |
| Double bookings | Central validation plus automated overlap tests. |
| Requirements misunderstood | Keep testable acceptance criteria with each story. |
| Work is not attributable | Use Jira-key branches, commits and pull requests. |
| Clean checkout fails | Dependency-free runtime and documented start/test commands. |
| Personal data exposure | Use fictional data and keep secrets out of Git. |

## Verification

Run `npm start`, open `http://localhost:3000`, then run `npm test` in another terminal. Manual checks are documented in `docs/TEST_PLAN.md`.

## Meetings and decisions

No team meeting is recorded yet. Add a dated entry only after a real meeting, including attendees, decisions, actions and owners.

## Retrospective placeholder

Complete after the sprint with factual evidence: what helped, what slowed the team, and one concrete improvement for the next iteration.
