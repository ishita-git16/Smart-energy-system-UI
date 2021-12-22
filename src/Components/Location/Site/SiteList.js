import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const columns = [
  {
    title: "Site Name",
    dataIndex: "sitename",
    key: "sitename",
  },
];
var x = [];
const SiteList = () => {
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

        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].name === name) {
            setData5(res.data.data[i].areas[i].sites);
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
export default SiteList;
