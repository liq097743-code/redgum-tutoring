# Test plan

## Automated tests

Run `npm test` from a clean checkout.

| Test area | Expected result |
|---|---|
| Booking inside availability | Accepted |
| Booking outside availability | Rejected with a clear message |
| Overlap with active session | Rejected |
| Time formerly held by cancelled session | Accepted |
| Editing an existing session | Does not conflict with itself |
| Monday-to-Sunday week calculation | Correct boundaries |

## Manual acceptance checks

1. Add and edit a student.
2. Add a tutor and add a second availability window.
3. Book a session inside the matching window.
4. Attempt a booking outside the window and confirm it is rejected.
5. Attempt an overlapping booking and confirm it is rejected.
6. Move the original booking to another valid time.
7. Mark it Attended, then check the dashboard count.
8. Create another booking, cancel it and reuse its time.
9. Filter the schedule to one day and one week.
10. Open a tutor's upcoming list and a student's complete history.
11. Check layout and keyboard navigation at desktop and mobile widths.
12. Clone into a clean directory and follow only the README to run and test it.

## Test data and privacy

Only fictional `.example.test` contacts are included. Do not enter or commit real student information during assessment demonstrations.
