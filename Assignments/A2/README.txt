COMP2406 - Assignment 2: Server-side programming with AJAX
New Home Animal Rescue
==========================================================

HOW TO RUN
----------
    node server.js
Then open http://localhost:3000/ . No installation is needed (only the built-in
http, fs, path and url modules are used). The server loads every .json file in
data/shelters/ first and only starts listening once that has finished. Dropping an
additional shelter .json file into that folder (same format) requires no code changes.
Applications are kept in RAM only, so restarting the server empties the list.

URLS
----
Pages:   /   /browse   /browse?shelterId=sn   /details?petId=pn&shelterId=sn
         /apply?...    /applications   /about
Data:    GET  /shelters                          basic shelter info (no pets)
         GET  /shelters?id=sn                    full shelter (with pets) or 404
         GET  /shelters/pets?petId=&shelterId=   one pet, or 404
         POST /submitapplication                 JSON body; stores the application
         GET  /applications-data                 JSON array summarizing all applications
         PUT  /applications-update               {applicationId, status}
         GET  /applications-details?id=a4        full application, or 404

ACKNOWLEDGEMENTS / REFERENCES
-----------------------------
- Images: All images were generated using the openart.ai website (carried over from the
  A1 solution that this assignment was built on).
- Text: Most of the website text came from the A1 solution, which was generated using
  ChatGPT. The code comments and this README were written with the help of Claude.

USE OF A.I.
-----------
Claude (Anthropic's AI assistant) was used to help write the server.js, the client-side
JavaScript (browse.js, pet.js, apply.js, applications.js), the new applications.html page
and its CSS, and this README. The code was tested by running the server and exercising every
route with curl and an automated browser test (browse -> details -> back -> apply ->
submit -> view/update applications).

DESIGN DECISIONS BEYOND THE REQUIREMENTS
----------------------------------------
Server
- Static files are only served from /css, /js, /images and /data/aboutData.js. server.js and
  the raw shelter .json files cannot be downloaded, and ".." paths are rejected.
- POST/PUT bodies are validated: bad JSON or an unknown pet/shelter returns 400, an invalid
  status returns 400, and an unknown application id returns 404. Only known application fields
  are stored. Bodies larger than ~1MB are refused.
- Shelters are sorted by id (s1, s2, ...) rather than by file name so the drop-down order is stable.
- /applications-data returns only the summary fields; the applicant's personal details are only
  available from /applications-details.

Browse page
- If the user changes shelters quickly, a late response for an old shelter is ignored.
- The A1 data contains one pet with type "Parrot", which has no type button. Parrots are
  grouped under the "Birds" button so every pet can be reached through a type button.
- Errors (e.g., server unreachable) are shown on the page instead of failing silently.
- Returning with "Back to Browsing" re-selects the shelter and resets the type button to "All".

Apply page
- The Submit button is disabled while the request is in progress, and the "Thank you" message is
  only shown after the server confirms it received the application. If the server rejects it, an
  error is shown and the form is kept so nothing the user typed is lost.

Applications page
- Status drop-downs and the status badge are colour-coded: Unprocessed = grey, Pending = yellow,
  Rejected = red, Approved = green. If a status update fails on the server, the drop-down goes back
  to its previous value and an error message is displayed.
- Applicant-entered text is inserted using textContent, so it can never be interpreted as HTML.
- View buttons toggle (only one at a time) and use the same brown/orange scheme as the navigation
  links. The details are shown as four cards: Application, Pet Requested (with image),
  Applicant, and Household. Changing the status while a card is open updates the card too.
- The applicant details and the pet data are requested at the same time (async/await).

NOTES FOR THE TA
----------------
- To see data on the applications page, first submit a few applications through
  Browse Pets -> View Details -> Apply to Adopt this Pet.
- Fields on the application form are not required (same as A1); only the two agreement
  check-boxes are, which enable the Submit button.
