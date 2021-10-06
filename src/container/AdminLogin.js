import React from "react";
import styled from "styled-components";
import withFirebaseAuth from "react-with-firebase-auth";
import { useHistory } from "react-router";
import Card from "@material-ui/core/Card";
import firebase from "../util/firebase";
import Swal from "sweetalert2";

import googleSingIn from "../assets/images/btn_google_signin_light_disabled_web@2x.png";
import { handleCheckIsAdmin } from "../util/api";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const AdminLogin = (props) => {
  const { signInWithGoogle, signOut } = props;
  const history = useHistory();

  const handleSignIn = () => {
    signInWithGoogle().then((res) => {
      const { email } = res.user.multiFactor.user;
      let checkEmail;
      if (email.split("@")[0].indexOf(".") > 0) {
        checkEmail = email.split("@")[0].split(".")[0];
      } else {
        checkEmail = email.split("@")[0];
      }

      handleCheckIsAdmin(checkEmail).then((res) => {
        if (res.data) {
          history.push("/");
        } else {
          Swal.fire("無管理者權限。");
          signOut();
          history.push("/");
        }
      });
    });
  };

  return (
    <SignInWrapper>
      <SignInText>管理者登入</SignInText>
      <SignInButton
        onClick={handleSignIn}
        src={googleSingIn}
        alt="google-sign-in"
      />
    </SignInWrapper>
  );
};

const SignInWrapper = styled(Card)`
  padding: 20px 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 150px; ;
`;

const SignInButton = styled.img`
  transform: scale(0.6);
  cursor: pointer;

  &:hover {
  }
`;

const SignInText = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff5733;
  /* padding: 20px 5px; */
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(AdminLogin);
