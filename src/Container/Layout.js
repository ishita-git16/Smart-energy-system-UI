import React, { useState, useEffect } from "react";
import {
  DesktopOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GatewayOutlined,
  RadarChartOutlined,
  SnippetsOutlined,
  BarChartOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Menu, Layout, Dropdown } from "antd";
import { Link } from "react-router-dom";
import logo from "../Container/logo.svg";
import "../Container/layout.css";
import TheContent from "./TheContent";
import TopBar from "./PageHeader";
// import React, { useState } from "react";
import { Select, PageHeader } from "antd";
import { Typography, Space } from "antd";
import { logoutUser } from "../Actions/AuthAction";
import { useHistory } from "react-router-dom";
import { org_Selection, set_current_org } from "../Actions/OrgSelection";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// const { Text} = Typography;
const { Option } = Select;
const { Sider, Footer } = Layout;
const { SubMenu } = Menu;

const TheLayout = () => {
  const userLogout = () => {
    dispatch(logoutUser());
  };
  let history = useHistory();
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  const dispatcher = useDispatch();
  const dispatch = useDispatch();
  const [curren_org_name, setCurrentOrg] = useState(undefined);
  const onChange = (value, key) => {
    setCurrentOrg(value);
    dispatcher(set_current_org(key.key));

    localStorage.setItem(
      "current_selected_org",
      JSON.stringify({ organisationid: key.key, organisationname: value })
    );
    // if (window.location.pathname !== "/panel") {
    //   history.push("/panel");
    //   // console.log("");
    // }
  };
  //   const menuClickHandle = (item) => {
  //     return(
  //     clickItem(item.key)
  //     )
  // }
  const [collapsed, setCollapsed] = useState(false);
  const [user, SetUser] = useState("admin");
  const onCollapse = (e) => {
    console.log(collapsed);
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    // API for fetching panel list (all without filtering)
    axios({
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("JWTtoken"),
      },
      url: `/getallorgs`,
    })
      .then((res) => {
        console.log(res.data);

        const current_org = JSON.parse(
          localStorage.getItem("current_selected_org")
        );
        if (current_org) {
          dispatcher(
            org_Selection({
              org_list: res.data,
              current_org: current_org.organisationid,
              curren_org_name: current_org.organisationname,
            })
          );
          setCurrentOrg(current_org.organisationname);
        } else {
          dispatcher(
            org_Selection({
              org_list: res.data,
              current_org: res.data[0].organisationid,
              curren_org_name: res.data[0].organisationname,
            })
          );
          setCurrentOrg(res.data[0].organisationname);
        }

        // dispatcher(set_current_org(res.data[0].organisationid ));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const menu = (
    <Menu>
      {/* <Menu.Item key="0">
        <a href="">Profile</a>
      </Menu.Item> */}
      {/* <Menu.Item key="1">
        <a href="https://www.aliyun.com">Logout</a>
      </Menu.Item> */}
      <Menu.Divider />
      <Menu.Item
        key="3"
        onClick={() => {
          userLogout();
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo1">
            <img src={logo} height="80px" width="65px" />
          </div>

          <div className="logo">
            {" "}
            <p className="l">
              <>
                <Space>
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <p
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      <p style={{ marginTop: "1px" }}>
                        Welcome User <DownOutlined />
                      </p>
                    </p>
                  </Dropdown>
                </Space>
              </>
            </p>{" "}
          </div>
          <Menu theme="dark" mode="inline">
            <SubMenu key="sub1" icon={<DesktopOutlined />} title="Masters">
              <Menu.Item
                key="1"
                icon={<RadarChartOutlined />}
                title="Location"
                Link
                to="/location"
              >
                <Link to="/location">Location </Link>
              </Menu.Item>

              <Menu.Item key="2" icon={<GatewayOutlined />} title="Panels">
                <Link to="/panel">Panels </Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<SnippetsOutlined />} title="Reports">
              <Menu.Item key="4" icon={<BarChartOutlined />}>
                <Link to="/hbreports">Heartbeat </Link>
              </Menu.Item>
            </SubMenu>

            <Menu.Item key="sub3" icon={<SnippetsOutlined />} title="Dashboard">
              <Link to="/dashboard"> Dashboard </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ minWidth: "100vh" }}>
          <PageHeader
            className="site-layout-background"
            style={{ padding: 0 }}
            ghost={true}
            title={React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: onCollapse,
                style: { paddingLeft: "10px" },
              }
            )}
            extra={[
              <table>
                <td style={{ paddingRight: "10px" }}>
                  <h1> Organisation : </h1>
                </td>
                <td style={{ marginRight: "100px" }}>
                  <Select
                    showSearch
                    style={{
                      width: 200,
                      marginTop: "10px",
                      marginBottom: "10px",
                      marginRight: "10px",
                    }}
                    subTitle
                    placeholder="Select Organisation"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    value={curren_org_name}
                    onChange={onChange}
                  >
                    {OrgSelection.org_list.map((org) => (
                      <Option
                        value={org.organisationname}
                        key={`${org.organisationid}`}
                      >
                        {org.organisationname}
                      </Option>
                    ))}
                  </Select>
                </td>
              </table>,
            ]}
          ></PageHeader>

          <TheContent />
          <Footer
            style={{
              textAlign: "center",
              backgroundColor: "gray",
              position: 0,
              height: "50px",
            }}
          >
            Integrated Active Monitoring Pvt. Ltd.
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};
export default TheLayout;
