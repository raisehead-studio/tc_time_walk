import React from "react";
import styled from "styled-components";
import withFirebaseAuth from "react-with-firebase-auth";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../../util/firebase";
import { Switch, Route } from "react-router-dom";

import SignInCard from "../SignInCard/SignInCard";
import { handleFetchAdmin, handleIsAdmin } from "../../redux/user";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const LoginRequired = (props) => {
  const { user, signOut, signInWithGoogle } = props;
  const { users, isAdmin } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(handleFetchAdmin());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(handleIsAdmin(user));
  }, [user]);

  const handleSignIn = () => {
    signInWithGoogle();
  };

  console.log(isAdmin);

  // signOut();

  if (!user) {
    return (
      <SingInWrapper>
        <SignInCard signInWithGoogle={handleSignIn} />
      </SingInWrapper>
    );
  }

  return <Route {...props} />;
};

const SingInWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(LoginRequired);
