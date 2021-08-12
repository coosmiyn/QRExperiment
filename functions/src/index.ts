import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as path from "path";

const exphbs = require('express-handlebars');

const app = express();
admin.initializeApp();

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
}));

app.set('view engine', 'hbs');
const publicPath = path.join(__dirname, '../views/lib');
app.use(express.static(publicPath));

exports.app = functions.https.onRequest(app);

// Manages requests coming from QR codes with URLs for a specific location
// Firebase Auth UIDs are used to check if the user has accessed the QR code before so it logs only once.
// Updates the data if needed and then redirects the user to a dynamic page to display the data depending on the location.
app.get(`/:uid/:location`, async (req, res) => {
  const location = req.params.location;
  const doc = await admin.firestore().collection('Data').doc(`${location}`).get();
  const docData = doc.data();

  if (docData) {
    const UIDs = docData.UIDs;

    if (!UIDs.includes(req.params.uid)) {
      console.log("does not contain");
      docData.OpenCount = docData.OpenCount + 1;
      docData.UIDs.push(req.params.uid);
      await admin.firestore().collection('Data').doc(`${location}`).update(docData);
    } else {
      //res.send("Looks like you've opened this before you cheeky bastard");
    }

    res.redirect(`/api/data/${location}/opencount`);
  }
  // Error Handling in case the document reference is not valid.
  else {
    console.log(`Cannot find ${req.params.location}`);

    res.redirect('/api/error');
  }
});

// Dynamic page which will display a Handlebars page to display the data.
app.get(`/api/data/:location/opencount`, async (req, res) => {
  const location = req.params.location;
  const doc = await admin.firestore().collection('Data').doc(`${location}`).get();
  const docData = doc.data();
  
  if (docData) {
    // Render the page with the data, template making it easy to display data for any location.
    res.render('home.hbs', {location: req.params.location.toUpperCase(), openCount: docData.OpenCount});
  } 
  else {
    console.log(`Cannot find ${req.params.location}`);
    res.send("Error: Couldn't find document location");
  }
});

// -------------------- Clubhub Test --------------------

app.get('/api/venues/:city/:venue', async (req, res) => {
  const docRef = await admin.firestore().collection(`${req.params.city}`).doc(`${req.params.venue}`).get();
  const docData = docRef.data();
  if (docData) {
    res.send(`Your data is\n${docData}`);
  }
  else {
    res.send('Error. Venue not found in our database');
  }
});

app.get('/api/venues/:city', async (req, res) => {
  const collectionRef = await admin.firestore().collection(`${req.params.city}`).get();
  const docs = collectionRef.docs;
  let venuesString = "";
  docs.forEach((doc) => {
    venuesString = venuesString + ", " + doc.id;
  });
  if (venuesString != "") {
    res.send(`Venues in ${req.params.city.toUpperCase()} are: ${venuesString}`);
  }
  else {
    res.send('Error. No venues found.');
  }
})

// If any other path is taken, display an error.
app.get('*', (req, res) => {
  res.send("Error 404. Page not found");
});


// Function to manage GET requests with additional parameters.
// Parameters are not defined so they would need to be handled wel.
// app.get('/:uid/:location/*', async (req, res) =>
// {
//   console.log('logging parameters');
//   console.log(req.params);

//   res.send("Printing parameters");
// });
