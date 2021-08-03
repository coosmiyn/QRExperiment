import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
//const cors = require('cors');

const app = express();
admin.initializeApp();
//const router = express.Router();
//app.use(cors);
//Here we are configuring express to use body-parser as middle-ware.

exports.app = functions.https.onRequest(app);

app.get('/', async (req, res) => {
  //res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  const date = new Date();
  const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
  res.send(`
    <!doctype html>
    <head>
      <title>Time</title>
      <link rel="stylesheet" href="/style.css">
      <script src="/script.js"></script>
    </head>
    <body>
      <p>In London, the clock strikes:
        <span id="bongs">${'BONG '.repeat(hours)}</span></p>
      <button onClick="refresh(this)">Refresh</button>
    </body>
  </html>`);
});

app.get(`/:location`, async (req, res) =>
{
  const location = req.params.location;
  const doc = await admin.firestore().collection('Data').doc(`${location}`).get();
  const docData = doc.data();

  if (docData)
  {
    docData.OpenCount = docData.OpenCount + 1;
    await admin.firestore().collection('Data').doc(`location`).update(docData);

    res.redirect(`/api/data/${location}/opencount`);
  }
  else
  {
    console.log(`Cannot find ${req.params.location}`);
    res.send("Error: Couldn't find document location");
  }
});

app.get(`/api/data/:location/opencount`, async (req, res) => 
{
  const doc = await admin.firestore().collection('Data').doc('Zimnicea').get();
  const docData = await doc.data();
  if (docData)
  {
    res.json(docData);
  }
  else
  {
    console.log(`Cannot find ${req.params.location}`);
    res.send("Error: Couldn't find document location");
  }
});

// NOT TESTED YET
// app.post('/api/data/:location/opens', async (req, rest) =>
// {
//   const location = req.params.location;
  
//   const doc = await admin.firestore().collection('Data').doc(`${location}`).get();
//   const docData = doc.data();
//   if (docData)
//   {
//     let opens = docData.Opens;
//     opens = opens + 1;

//     await admin.firestore().collection('Data').doc(`${location}`).update( { Opens: opens} );
//   }
// })

//app.get('/api', (req, res) => {
  
// });
