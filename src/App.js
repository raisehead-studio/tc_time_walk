import styled from "styled-components";
import { Switch, Route } from "react-router-dom";

import LiveStreamPage from "./container/LiveStreamPage";
import SettingPage from "./container/SettingPages";

function App() {
  return (
    <AppWrapper>
      <Switch>
        <Route path="/live-stream/:videoId" component={LiveStreamPage} />
        <Route path="/setting" component={SettingPage} />
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
