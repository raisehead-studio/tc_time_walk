import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";

import googleSingIn from "../../assets/images/btn_google_signin_light_disabled_web@2x.png";

const SignInCard = ({ signInWithGoogle }) => {
  return (
    <SignInWrapper>
      <SignInText>登入</SignInText>
      <SignInButton
        onClick={signInWithGoogle}
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

export default SignInCard;
