import React, {useEffect, useState} from "react";
import {Col, Layout, Row, Menu} from "antd";
import moment from "moment";
import TheContent from "./Content";
import { Link } from "react-router-dom";
const {Header, Footer, Sider, Content} = Layout;
const { SubMenu } = Menu;
const MainScreen = () => {

  return (
    <>
      <Layout
        // className="site-layout"
        style={{ height: "100vh", 
        minWidth: "80vh" 
    }}
      >
           <Header>

           <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        {/* <Link to = "/ethereum"> */}
        <Menu.Item key="1">
          
          Ethereum
         
          </Menu.Item>
           {/* </Link> */}
        <Menu.Item key="2">
        {/* <Link to = "/solana"> */}
        Solana
          {/* </Link> */}
          </Menu.Item>
        <Menu.Item key="3">
        {/* <Link to = "/cardano"> */}
          Cardano
          {/* </Link> */}
          </Menu.Item>
      </Menu>
           </Header>
           <Layout>             
           {/* <Sider 
             style={{ height: "220vh", minWidth: "70vh", backgroundColor:"skyblue"}}>
                 Sider
                 </Sider> */}
        <TheContent />
        </Layout>
            {/* <Footer
            className="ant-layout-footer"
            style={{
                textAlign: "center",
                backgroundColor: "#DBDDE0",
                // marginBottom:"10px",
                // position: "10vh",
                // minHeight: "2vh",
                // minWidth: "100vh",
                maxHeight: "10px",

            }}
            >
                <div> Powered by : Integrated Active Monitoring Pvt. Ltd.</div>
            </Footer> */}
      </Layout>
    </>
  );
};

export default MainScreen;
