import React from "react";
import styled from "styled-components";
import withFirebaseAuth from "react-with-firebase-auth";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

import { handleFetchAdmin } from "../redux/user";
import firebase from "../util/firebase";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const AdminLogin = (props) => {
  const { signInWithEmailAndPassword } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = React.useState({
    accounts: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState((state) => ({ ...state, [name]: value }));
  };

  const handleSingInWithEmailAndPassword = () => {
    const { accounts, password } = state;
    signInWithEmailAndPassword(accounts, password).then((res) => {
      // dispatch(updateUser(res));
      // history.push("/settings");
    });
  };

  React.useEffect(() => {
    dispatch(handleFetchAdmin());
  }, [dispatch]);

  return (
    <AdminLoginWrapper>
      <Inputs
        label="管理者帳號"
        type="text"
        value={state.accounts}
        onChange={handleChange}
        name="accounts"
      />
      <Inputs
        label="管理者密碼"
        type="password"
        value={state.password}
        onChange={handleChange}
        name="password"
      />
      <Button onClick={handleSingInWithEmailAndPassword}>登入</Button>
    </AdminLoginWrapper>
  );
};

const AdminLoginWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 60%;
  margin-top: 150px;
  align-items: center;
  padding: 20px;
`;

const Inputs = styled(TextField)`
  margin: 10px 5% !important;
  width: ${(p) => `${p.width ? p.width : "90"}%`};

  .MuiFormControl-root {
    margin: 10px 0px;
  }
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(AdminLogin);
