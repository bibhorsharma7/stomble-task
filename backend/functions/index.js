const functions = require("firebase-functions");
const express = require("express");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

app.get("/", async (req, resp) => {
  const result = await admin.firestore().collection("cards").get();

  var cards = []
  result.forEach((doc) => {
    let data = doc.data();

    cards.push(data)
  });

  resp.status(200).send(JSON.stringify(cards))
});

app.post("/", async (req, resp) => {
  const card = req.body;

  await admin.firestore().collection("cards").add(card);

  resp.status(200).send();
});

exports.cards = functions.https.onRequest(app);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
