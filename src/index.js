import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { store } from "./redux/store";
import { Provider } from "react-redux";

import DateFnsUtils from "@date-io/date-fns";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <App />
        </MuiPickersUtilsProvider>
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
