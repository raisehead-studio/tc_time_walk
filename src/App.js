import styled from "styled-components";
import { Route, Switch } from "react-router-dom";

import LoginRequired from "./components/LoginRequired/LoginRequired";
import LiveStreamPage from "./container/LiveStreamPage";
import EventRegisterForm from "./container/EventRegisterForm";
import SettingPage from "./container/SettingPages";
import AdminLogin from "./container/AdminLogin";
import firebase from "./util/firebase";

const firebaseAppAuth = firebase.auth();

function App({ user }) {
  return (
    <AppWrapper>
      <Switch>
        <Route path="/admin" component={AdminLogin} />
        <LoginRequired exact path="/" component={SettingPage} />
        <LoginRequired
          path="/event_signup/:eventId"
          component={EventRegisterForm}
        />
        <LoginRequired
          path="/live-stream/:videoId"
          component={LiveStreamPage}
        />
      </Switch>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: rgb(250, 229, 211);
`;

export default App;
