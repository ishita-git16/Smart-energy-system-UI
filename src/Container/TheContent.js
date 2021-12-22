import React, { useState, Suspense } from "react";
import routes from "../routes";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.css";
const { Content } = Layout;

const TheContent = ({ user }) => {
  const [isAuth, setIsAuth] = useState(true);
  return (
    <>
      <Content
        // style={{ margin: "24px 16px 0" }}
        className="site-layout-background"
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          height: "200vh",
          
        }}
      >
        {/* <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}
        > */}
        <Suspense>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) =>
                      isAuth == true ? (
                        <route.component {...props} />
                      ) : (
                        <Redirect to="/login" />
                      )
                    }
                  />
                )
              );
            })}
            <Redirect from="/login" to="/" />
          </Switch>
        </Suspense>
        {/* </div> */}
      </Content>
    </>
  );
};

export default TheContent;
