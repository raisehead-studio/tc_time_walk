import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import withFirebaseAuth from "react-with-firebase-auth";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../../util/firebase";
import { Switch, Route } from "react-router-dom";

import SignInCard from "../SignInCard/SignInCard";
import { handleCheckIsAdmin } from "../../util/api";
import { handleIsAdmin } from "../../redux/user";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const LoginRequired = (props) => {
  const history = useHistory();
  const { user, signOut, signInWithGoogle } = props;
  const { isAdmin } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (user) {
      const { email } = user.multiFactor.user;
      if (email === "tctimewalk3.0@gmail.com" || "hinrick71@gmail.com") {
        dispatch(handleIsAdmin(true));
      } else {
        dispatch(handleIsAdmin(false));
      }
    }
  }, [user]);

  const handleSignIn = () => {
    signInWithGoogle();
  };

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
  width: 50%;
  height: 250px;
  display: flex;
  justify-content: center;
  transform: translateY(70px);

  @media (max-width: 750px) {
    width: 80%;
  }

  /* align-items: center; */
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(LoginRequired);
