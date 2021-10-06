import styled from "styled-components";
import { Route, Switch } from "react-router-dom";
import withFirebaseAuth from "react-with-firebase-auth";

import LoginRequired from "./components/LoginRequired/LoginRequired";
import LiveStreamPage from "./container/LiveStreamPage";
import EventRegisterForm from "./container/EventRegisterForm";
import SettingPage from "./container/SettingPages";
import AdminLogin from "./container/AdminLogin";
import UserEventLists from "./container/UserEventLists";
import PayFailPage from "./container/PayFailPage";
import PaySuccedPage from "./container/PaySuccedPage";
import Header from "./components/Header";
import Spinner from "./components/Spinner/Spinner";
import SignOut from "./container/SignOut";

import firebase from "./util/firebase";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

function App() {
  console.log(process.env.REACT_APP_CLIENT_ID);

  return (
    <AppWrapper>
      <Header />
      <Switch>
        <Route path="/admin" component={AdminLogin} />
        <Route path="/sign_out" component={SignOut} />
        <LoginRequired exact path="/" component={SettingPage} />
        <LoginRequired path="/event_list/:uid" component={UserEventLists} />
        <LoginRequired
          path="/event_signup/:eventId"
          component={EventRegisterForm}
        />
        <LoginRequired
          path="/live-stream/:videoId"
          component={LiveStreamPage}
        />
        <LoginRequired path="/pay-success" component={PaySuccedPage} />
        <LoginRequired path="/pay-fail" component={PayFailPage} />
      </Switch>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100vw;
  background-image: linear-gradient(
    135deg,
    rgba(43, 131, 151, 0.2) 0%,
    rgba(248, 225, 128, 0.2) 100%
  );
  height: 100vh;
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
