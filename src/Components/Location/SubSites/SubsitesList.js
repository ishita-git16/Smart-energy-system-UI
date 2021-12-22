import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddChildSubsites from "../SubSites/AddChildSubsite";
import EditSubsite from "../SubSites/EditSubsite";
import AddSubsite from "../SubSites/AddSubsite";
import EditChildSubsite from "../ChildSubsites/EditChildSubsite";
import AddInputToChildSubSite from "../ChildSubsites/AddInputToChildSubsite";
import NewAddInputToSite from "../Site/NewAddInputToSite";

const SubsitesList = () => {
  const { id } = useParams();
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `getsubsites/siteid?orgid=${OrgSelection.current_org}&siteid=${id}`,
    })
      .then((res) => {
        const SitesFormatData = res.data.data.map((subsite) => {
          return {
            value: subsite.sub_site_id,
            label: subsite.sub_site_name,
            sub_site_id: subsite.sub_site_id,

            children: subsite.children.map((ChildSubsite) => {
              return {
                value: ChildSubsite.child_sub_site_id,
                label: ChildSubsite.child_sub_site_name,
                child_sub_site_id: ChildSubsite.child_sub_site_name,
              };
            }),
          };
        });
        setData(SitesFormatData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [OrgSelection.current_org]);

  const columns = [
    {
      title: "Subsite Name",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (a) => (
        <div>
          <Space size="middle">
            <EditSubsite mydata={a} />
            <NewAddInputToSite mydata={a} />
            <AddChildSubsites mydata={a} />
          </Space>
        </div>
      ),
    },
  ];

  const data1 = [];
  for (let i = 0; i < data.length; ++i) {
    data1.push({
      key: data[i].value,
      name: data[i].label,
      child_sites: data[i].children,
    });
  }

  function generatetable(rows) {
    const columns = [
      { title: "ChildSubsite Name", dataIndex: "label", key: "name" },
      {
        title: "Action",
        key: "x",
        dataIndex: "",
        render: (a) => (
          <Space>
            <EditChildSubsite mydata={a} />
            <AddInputToChildSubSite mydata={a} />
          </Space>
        ),
      },
    ];
    //Child subsiteslist display
    return (
      <Table
        size="small"
        pagination={false}
        className="components-table-demo-nested"
        columns={columns}
        dataSource={rows}
        scroll={{ y: 500 }}
      />
    );
  }
  //Main subsitelist Display
  return (
    <>
      <AddSubsite />
      <Table
        columns={columns}
        dataSource={data1}
        size="small"
        scroll={{ y: 400 }}
        expandable={{
          expandedRowRender: (record) => generatetable(record.child_sites),
        }}
      />
    </>
  );
};
export default SubsitesList;
