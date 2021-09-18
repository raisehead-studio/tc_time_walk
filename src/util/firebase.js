import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const config = {
  apiKey: "AIzaSyDcNqgeHL1kF5rc6gZsQ62pDDCsynmBWHM",
  authDomain: "beans-tool-bi-test-deplyed.firebaseapp.com",
  projectId: "beans-tool-bi-test-deplyed",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;
