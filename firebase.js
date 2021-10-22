const firebase = require("firebase/app");
require("firebase/analytics");

require("firebase/auth");
require("firebase/firestore");


const firebaseConfig = {
  apiKey: "AIzaSyBVlcWpU8qwOULwz1iDYXMKfhvb4VvxB1E",
  authDomain: "siv-2021.firebaseapp.com",
  projectId: "siv-2021",
  storageBucket: "siv-2021.appspot.com",
  messagingSenderId: "497172734523",
  appId: "1:497172734523:web:6021e9133a8a966aa2b21e",
  measurementId: "G-TNSJN6DRB3"
};
firebase.initializeApp(firebaseConfig);