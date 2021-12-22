import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./App.css";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import TheLayout from "./Container/TheLayout";
import TheLayout from "./Container/Layout";
import jwt_decode from "jwt-decode";
import { loginUser } from "./Actions/AuthAction";
import SignInSide from "./Components/Signin";
import "antd/dist/antd.css";

function App() {
  const [loading, setLoading] = useState(true);
  const authReducer = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.location.pathname !== "/login") {
      if (localStorage.JWTtoken) {
        const token = localStorage.getItem("JWTtoken");
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000; // to get in milliseconds
        if (decoded.exp < currentTime) {
          window.location.href = "/login";
        } else {
          const data = {
            isLogged: true,
            userId: decoded.userid,
            userName: decoded.name,
          };

          dispatch(loginUser(data));
        }
      } else {
        window.location.href = "/login";
      }
    }
    setLoading(false);
  }, []);

  return loading ? (
    <h1 style = {{ marginLeft: "50px", marginTop: "50px"}}>Loading</h1>
  ) : (
    <>
      <Router>
        <Switch>
          {/* <Route path="/login">
            <SignInSide />
          </Route>
          {authReducer.isLogged ? (
            <Switch> */}
              <Route path="/">
                <TheLayout />
              </Route>
            {/* </Switch>
          ) : (
            <Redirect
              push
              to={{
                pathname: "/login",
                state: {
                  from: window.location.href,
                },
              }}
            />
          )} */}
        </Switch>
      </Router>
    </>
  );
}
export default App;
