/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
// const firebase = require("firebase/app");

require("firebase/auth");
const serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://siv-2021.firebaseio.com",
});
const db = admin.firestore();
app.use(cors({origin: true}));

// eslint-disable-next-line require-jsdoc
// async function register(req, res) {
//   const {email, password} = req.body;
//   try {
//     const teste = admin.auth()
// .createUserWithEmailAndPassword(email, password);
//     console.log(teste);
//     // const {uid} = await admin.auth().createUser(req.body);
//     // await admin.auth().setCustomUserClaims(uid, {role: req.body.role});
//   } catch (err) {
//     handleError(res, err);
//   }
// }

// function handleError(res, err) {
//   return res.status(500).send({message: `${err.code} - ${err.message}`});
// }
// create
app.post("/api/create/:collection", (req, res) => {
  const data = req.body;
  (async () => {
    try {
      // if (req.params.collection === "users") {
      //   uid = await register(req, res);
      // }
      await db.collection(req.params.collection)
          .add(data);
      return res.status(200).send("Uhull");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// read item
app.get("/api/read/:collection/:item_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection(req.params.collection)
          .doc(req.params.item_id);
      const item = await document.get();
      const response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// read all
app.get("/api/read/:collection", (req, res) => {
  (async () => {
    try {
      const query = db.collection(req.params.collection);
      const response = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        for (const doc of docs) {
          // const selectedItem = {
          //   id: doc.id,
          //   item: doc.data(),
          // };
          const Doc = doc.data();
          Doc.id = doc.id;
          response.push(Doc);
        }
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// update
app.put("/api/update/:collection/:item_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection(req.params.collection)
          .doc(req.params.item_id);
      await document.update(req.body);
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// delete
app.delete("/api/delete/:collection/:item_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection(req.params.collection)
          .doc(req.params.item_id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// login
app.post("/api/auth", (req, res) => {
  const {email, password} = req.body;

  (async () => {
    try {
      const query = db.collection("users");
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        if (!docs.find((user)=>user.data().email===email)) {
          return res.status(500).send("The email not exist in database");
        }
        for (const doc of docs) {
          const user = doc.data();
          if (user.email===email) {
            if (user.password===password) {
              user.id = doc.id;
              return res.status(200).send(user);
            } else {
              return res.status(501).send("The password, is incorret");
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
exports.app = functions.https.onRequest(app);
// exports.app = function(req, res) {
//   res.send("Hello, world 4");
// };
