import React, { useState, useEffect } from "react";
import {Select, PageHeader } from "antd";
import { Typography, Space } from 'antd';
import { useHistory } from "react-router-dom";
import { org_Selection, set_current_org } from "../Actions/OrgSelection";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import TheLayout from "./Layout";


const { Text} = Typography;
const { Option } = Select;
const TopBar = () => {
  let history = useHistory();
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  const dispatcher = useDispatch();
  const [curren_org_name, setCurrentOrg] = useState(undefined);
  const onChange = (value, key) => {
    setCurrentOrg(value);
    dispatcher(set_current_org(key.key));

    localStorage.setItem("current_selected_org", JSON.stringify({organisationid:key.key, organisationname:value}))
    if (window.location.pathname !== "/panel") {
      history.push("/panel");
      console.log("");
    }
  };

  useEffect(() => {
    // API for fetching panel list (all without filtering)
    axios({
      method: "GET",
      headers: {
        Authorization:localStorage.getItem("JWTtoken")
      },
      url: `/getallorgs`,
    })
      .then((res) => {
        console.log(res.data);
        
           
           const current_org = JSON.parse(localStorage.getItem("current_selected_org"));
           if (current_org){
            dispatcher(org_Selection({ org_list: res.data ,current_org:current_org.organisationid,
              curren_org_name: current_org.organisationname}));
            setCurrentOrg(current_org.organisationname);     
           }
           else{
            dispatcher(org_Selection({ org_list: res.data ,current_org:res.data[0].organisationid,
              curren_org_name: res.data[0].organisationname}));
            setCurrentOrg(res.data[0].organisationname)
           }
           
        // dispatcher(set_current_org(res.data[0].organisationid ));

      })
      .catch((err) => {
        console.log(err);
      });
}, []);
  return (
    <>
    <PageHeader
     className="site-layout-background"
      style={{ padding: 0 }}
      // subTitle = "Select Organisation"
      ghost = {true}
      title = {React.createElement(MenuFoldOutlined)}
      extra={[
        <table>
        <td style={{paddingRight:"10px"}}>
        <h1> Organisation : </h1>
        </td>
        <td style={{marginRight:"100px"}}>
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
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
            <Option value={org.organisationname} key={`${org.organisationid}`}>
              {org.organisationname}
            </Option>
          ))}
        </Select>
        </td>
        </table>
      ]}
    ></PageHeader>
    </>
  );
};

export default TopBar;
