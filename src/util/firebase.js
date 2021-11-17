import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: "AIzaSyDu6QWUCAEFXgHFfR2rTXN_Lpgo8Pe7Pyc",
  authDomain: "tctimewalkadmin.firebaseapp.com",
  databaseURL: "https://tctimewalkadmin-default-rtdb.firebaseio.com",
  projectId: "tctimewalkadmin",
  storageBucket: "tctimewalkadmin.appspot.com",
  messagingSenderId: "875643054812",
  appId: "1:875643054812:web:b99129ce72955efcc6e219",
  measurementId: "G-L6REMPZLBR",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const db = getFirestore(firebase.initializeApp(config));

export default firebase;
