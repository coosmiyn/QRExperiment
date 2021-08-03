import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.bigben2 = functions.https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1 //London is UTC + 1hr;
  res.status(200).send(`<!doctype html>
      <head>
        <title>Time</title>
      </head>
      <body>
        ${'BONG '.repeat(hours)}
      </body>
    </html>`);
  });

exports.test2 = functions.https.onRequest((req, res) => {
  res.status(200).send("Ceaules");
});
