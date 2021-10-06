import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyDcNqgeHL1kF5rc6gZsQ62pDDCsynmBWHM",
  authDomain: "beans-tool-bi-test-deplyed.firebaseapp.com",
  databaseURL: "https://beans-tool-bi-test-deplyed-default-rtdb.firebaseio.com",
  projectId: "beans-tool-bi-test-deplyed",
  storageBucket: "beans-tool-bi-test-deplyed.appspot.com",
  messagingSenderId: "497187525287",
  appId: "1:497187525287:web:8c31f136d0d9a0a756c182",
  measurementId: "G-61WGR9BNC9",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const db = getFirestore(firebase.initializeApp(config));

export default firebase;
