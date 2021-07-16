const functions = require("firebase-functions");
const express = require("express");
const cors = require('cors');
// const cors = require('cors')({origin: true});

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

app.use(cors());

function validate(card) {
  if (card.name !== null && card.name === "")
    return false;
  
  const nameRe = /[0-9]$/;
  if (nameRe.test(card.name))
    return false;
  
  if (card.number !== null && card.number === "")
    return false;

  const nRe = /^([0-9]{16})$/;
  if (! nRe.test(card.number))
    return false;
  
  if (card.cvc !== null && card.cvc === "")
    return false;

  const cRe = /^[1-9][0-9]{2,3}$/;
  if (! cRe.test(card.cvc))
    return false;

  if (card.expiry !== null && card.expiry === "")
    return false
    
  const exRe = /^(0[1-9]|1[0-2])\/?((0[1-9])|([1-9][0-9]))$/;
  if (! exRe.test(card.expiry))
    return false;

  return true;
}

app.get("/", async (req, resp) => {
  // const result = await admin.firestore().collection("cards").get()
  admin.firestore().collection("cards").get()
  .then((result) => {
    var cards = []
    result.forEach((doc) => {
      let data = doc.data();
      cards.push(data)
    });
    resp.status(200).send(JSON.stringify(cards))
  })
  .catch(() => {
    resp.status(500).send()
  })
});


app.post("/", async (req, resp) => {
  const card = req.body.data;
  console.log(card);
  if (card === null) {
    resp.status(500).send('Bad Request');
  }

  
  admin.firestore().collection("cards").get()
  .then((result) => {
    let inDB = []
    result.forEach((doc) => {
      inDB.push(doc.data())
    });

    let exists = inDB.some((data) => {
      if (card.number === data.number) {
        return true;
      }
      return false;
    });

    if (exists) {
      resp.status(303).send('This card already exists')
    } else {
      if (! validate(card))
      resp.status(400).send('Please enter valid card details');

      admin.firestore().collection("cards").add(card)
      .then(() => {
        resp.status(200).send('Success')
      })
      // .then(() => {
      //   resp.status(200).send('Success');
      // })
      // .catch(() => {
      //   resp.status(500).send();
      // })
    }

    
  })
  .catch((err) => {
    console.log("going to give 500");
    console.log(err);
    resp.status(500).send();
  })
});

exports.cards = functions.https.onRequest(app);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
