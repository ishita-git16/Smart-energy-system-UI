import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { createStore } from "redux";
import combinedReducers from "./Reducers/Combined";
import { Provider } from "react-redux";

// axios.defaults.baseURL = "http://192.168.2.177:5511";
axios.defaults.baseURL = "http://192.168.1.239:5511";
// axios.defaults.baseURL = "https://iot.smart-iam.com/api/ui";
// axios.defaults.headers.common["Authorization"] =
//   localStorage.getItem("JWTtoken");
const store = createStore(
  combinedReducers
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
