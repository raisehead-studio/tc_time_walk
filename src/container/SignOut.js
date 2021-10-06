import withFirebaseAuth from "react-with-firebase-auth";
import { useHistory } from "react-router-dom";

import firebase from "../util/firebase";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const SignOut = ({ signOut }) => {
  const history = useHistory();
  signOut();
  setTimeout(() => {
    history.push("/");
  }, 1000);

  return <div />;
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(SignOut);
