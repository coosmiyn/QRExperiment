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

app.get('/home/:uid/:location', async (req, res) => {
  const location = req.params.location;
  const doc = await admin.firestore().collection('Data').doc(`${location}`).get();
  const docData = doc.data();
  let codeCheck = true;

  if (docData) {
    //const messagesOpenCountMap = docData.MessagesOpenCountMap;

    for (const id of Object.keys(docData.MessagesOpenCountMap)) {
      console.log(id, docData.MessagesOpenCountMap[id]);

      if (!docData.MessagesOpenCountMap[id].includes(req.params.uid)) {
        console.log("We've counted one");
        codeCheck = false;
      }
      else {
        console.log("Did not count anything");
      }
    }
  }

  res.render(`testhome.hbs`, {uid: req.params.uid, location: req.params.location, secretPage: codeCheck});
})

app.get('/secretHomePage/:uid/:location', async (req, res) => {
  res.render('secrethome.hbs', {uid: req.params.uid, location: req.params.location, secretPage: true});
})

app.get(`/visualisation/:uid/:location`, async (req, res) => {
  console.log('ajuns-am');
  const location = req.params.location;
  const doc = await admin.firestore().collection('Data').doc(`${location}`).get();
  const docData = doc.data();
  let codeCheck = true;

  console.log('hopaaa');

  if (docData) {
    //const messagesOpenCountMap = docData.MessagesOpenCountMap;
    console.log('rendering');
    //res.render('visualisation.hbs');
    // let obj = {
    //   Message: {},
    //   Opens: {},
    // };
    const passArray = [];
    for (let i = 0; i < docData.Messages.length; i++) {
      // obj.Message = docData.Messages[i];
      // obj.Opens = docData.MessagesOpenCount[i];
      if (docData.MessagesOpenCountMap[i].includes(req.params.uid))
      {
        passArray.push({
          Message: docData.Messages[i],
          Opens: docData.MessagesOpenCount[i],
        });
      }
    }

    for (let i = 0; i < passArray.length; i++) {
      console.log(`Message: ${passArray[i].Message}`);
      console.log(`Opens: ${passArray[i].Opens}`);
    }

    for (const id of Object.keys(docData.MessagesOpenCountMap)) {
      console.log(id, docData.MessagesOpenCountMap[id]);

      if (!docData.MessagesOpenCountMap[id].includes(req.params.uid)) {
        console.log("We've counted one");
        codeCheck = false;
      }
      else {
        console.log("Did not count anything");
      }
    }

    res.render('visualisation.hbs', {jsonObject: passArray, uid: req.params.uid, location: req.params.location, secretPage: codeCheck});
  }
  else {
    console.log('error mi-as pula');
    res.redirect('/api/error');
  }
});

// Manages requests coming from QR codes with URLs for a specific location
// Firebase Auth UIDs are used to check if the user has accessed the QR code before so it logs only once.
// Updates the data if needed and then redirects the user to a dynamic page to display the data depending on the location.
app.get(`/test/update/:uid/:location/:messageId`, async (req, res) => {
  const location = req.params.location;
  const doc = await admin.firestore().collection('Data').doc(`${location}`).get();
  const docData = doc.data();
  let codeCheck = true;
  //let redirect = false;

  if (docData) {
    //const UIDs = docData.UIDs;

    const messagesOpenCountMap = docData.MessagesOpenCountMap;

    if (!messagesOpenCountMap[req.params.messageId].includes(req.params.uid)) {
      console.log(`It works for message number ${req.params.messageId}`);
      docData.MessagesOpenCountMap[req.params.messageId].push(req.params.uid);

      docData.OpenCount = docData.OpenCount + 1;
      docData.MessagesOpenCount[req.params.messageId] = docData.MessagesOpenCount[req.params.messageId] + 1;

      await admin.firestore().collection('Data').doc(`${location}`).update(docData);

      // testMap.forEach((value: string, key: number) => {
      //   console.log("Iterating through map");
      //   if (value == req.params.uid) {
      //     counter = counter + 1;
      //   }
      //   else {
      //     console.log("Missing at least one message");
      //   }
      // });

      // if (counter == docData.MessagesOpenCountMap.length) {
      //   redirect = true;
      // }
    }
    else {
      console.log(`Something went wrong`);
    }

    // console.log(`length is ${messagesOpenCountMap.length}`);
    // console.log(messagesOpenCountMap);
    // for (let i = 0; i < messagesOpenCountMap.length; i++) {
    //   console.log(`testing for index ${i}`);
    //   if (!messagesOpenCountMap[i].includes(req.params.uid)) {
    //     console.log('testing our bool');
    //     codeCheck = false;
    //   }
    //   else {
    //     console.log('looking like meh');
    //   }
    // }
      
    //const testMap = docData.MessagesOpenCountMap;
    for (const id of Object.keys(docData.MessagesOpenCountMap)) {
      console.log(id, docData.MessagesOpenCountMap[id]);

      if (!docData.MessagesOpenCountMap[id].includes(req.params.uid)) {
        console.log("We've counted one");
        codeCheck = false;
      }
      else {
        console.log("Did not count anything");
      }
    }

    console.log(`our bool is: ${codeCheck}`);

    // if (!UIDs.includes(req.params.uid)) {
    //   console.log("does not contain");
    //   docData.OpenCount = docData.OpenCount + 1;
    //   docData.UIDs.push(req.params.uid);

    //   const messagesOpenCount = docData.MessagesOpenCount;
    //   messagesOpenCount[req.params.messageId] = messagesOpenCount[req.params.messageId] + 1;

    //   docData.MessagesOpenCount = messagesOpenCount;
      
    //   await admin.firestore().collection('Data').doc(`${location}`).update(docData);
    // } else {
    //   //res.send("Looks like you've opened this before you cheeky bastard");
    // }

    //res.redirect(`/${location}/opencount`);
    // if (!redirect) {
    //   console.log("redirect works");
    //   res.redirect(`/api/data/${location}/${req.params.messageId}/opencount`);
    // }
    // else {
    //   console.log("redirect doesn't work");
    // }

    console.log(`rendering ${codeCheck}`);
    res.render('home.hbs', {location: req.params.location, messageOpenCount: docData.MessagesOpenCountMap[req.params.messageId].length, 
      openCount: docData.OpenCount, secretPage: codeCheck, uid: req.params.uid});
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

// Dynamic page which will display a Handlebars page to display the data.
app.get(`/api/data/:location/:messageId/opencount`, async (req, res) => {
  const location = req.params.location;
  const doc = await admin.firestore().collection('Data').doc(`${location}`).get();
  const docData = doc.data();
  
  if (docData) {
    // Render the page with the data, template making it easy to display data for any location.
    res.render('home.hbs', {location: req.params.location.toUpperCase(), openCount: docData.OpenCount, messageOpenCount: docData.MessagesOpenCount[req.params.messageId]});
  } 
  else {
    console.log(`Cannot find ${req.params.location}`);
    res.send("Error: Couldn't find document location");
  }

  /*
  let counter = 0;
      
      //const testMap = docData.MessagesOpenCountMap;
      for (const id of Object.keys(docData.MessagesOpenCountMap)) {
        console.log(id, docData.MessagesOpenCountMap[id]);

        if (docData.MessagesOpenCountMap[id].includes(req.params.uid)) {
          counter = counter + 1;
          console.log("We've counted one");
        }
        else {
          console.log("Did not count anything");
        }
      }

      if (counter == docData.MessagesOpenCountMap.lengt) {
        redirect = true;
        console.log("redirec = true now")
      }
      else {
        console.log("redirect false");
      }
       */
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
