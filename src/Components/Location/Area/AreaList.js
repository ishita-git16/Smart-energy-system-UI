import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Space, Button, Menu, Dropdown } from "antd";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const columns = [
  {
    title: "Area Name",
    dataIndex: "name",
    key: "name",
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: (a) => (
      <div>
        {/* {user === "admin" ? ( */}
        <Space size="middle">
          {/* <Link to={"/paneledit/" + a.panelid}> */}
          <Button type="primary">Edit</Button>
          {/* </Link> */}
        </Space>
      </div>
    ),
  },
];
var x = [];
const AreaList = () => {
  const { name } = useParams();
  const [data5, setData5] = useState([]);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  useEffect(() => {
    // get region data
    axios({
      method: "GET",
      url: `/getorg/treeview?org_id=${OrgSelection.current_org}`,
    })
      .then((res) => {
        setData5(res.data.data);
        // var mydata=res.data.data;
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].name === name) {
            setData5(res.data.data[i].areas);
            break;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [OrgSelection.current_org]);

  return (
    <>
      <Table
        columns={columns}
        dataSource={data5}
        size="small"
        scroll={{ y: 400 }}
      />
    </>
  );
};
export default AreaList;
