import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Space, Select, Table, Divider, Form } from "antd";
import AddArea from "../Location/Area/AddArea";
import AddRegion from "../Location/Region/AddRegion";
import AreaEdit from "../Location/Area/AreaEdit";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const LocationList = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [regiontreedata, setRegionTreedata] = useState([]);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);

  useEffect(() => {
    // get region data
    axios({
      method: "GET",
      url: `/getorg/treeview?org_id=${OrgSelection.current_org}`,
      // url: `/treeview/newsite?orgid=${OrgSelection.current_org}`,
    })
      .then((res) => {
        const RegiontreeFormatData = res.data.data.map((region) => {
          return {
            value: region.regionid,
            label: region.name,
            children: region.areas.map((area) => {
              return {
                value: area.areaid,
                label: area.name,
                children: area.sites.map((site) => {
                  return {
                    value: site.siteid,
                    label: site.sitename,
                  };
                }),
              };
            }),
          };
        });

        setRegionTreedata(RegiontreeFormatData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [OrgSelection.current_org]);

  const columns = [{ title: "Region Name", dataIndex: "name", key: "name" }];

  const data1 = [];
  for (let i = 0; i < regiontreedata.length; ++i) {
    data1.push({
      key: regiontreedata[i].label,
      name: regiontreedata[i].label,
      areas: regiontreedata[i].children,
    });
  }

  // area data
  function generateusingrecord(record) {
    var rows = [];
    for (var i = 0; i < record.areas.length; i++) {
      rows.push({
        key: record.areas[i].label,
        name: record.areas[i].label,
        sites: record.areas[i].children,
        id: record.areas[i].value,
      });
    }
    return rows;
  }
  // area data
  function generatetable(rows) {
    const columns = [
      { title: "Area Name", dataIndex: "name", key: "name" },
      {
        title: "Action",
        key: "x",
        dataIndex: "",
        render: (a) => <AreaEdit {...a} />,
      },
    ];
    return (
      <Table
        size="small"
        pagination={false}
        className="components-table-demo-nested"
        columns={columns}
        dataSource={rows}
        scroll={{ y: 500 }}
        expandable={{
          expandedRowRender: (record) =>
            generatetable2(generateusingrecord2(record), record.sites),
        }}
      />
    );
  }

  // site data
  function generateusingrecord2(record) {
    var rows = [];
    for (var i = 0; i < record.sites.length; i++) {
      rows.push({
        key: record.sites[i].label,
        name: record.sites[i].label,
        id: record.sites[i].value,
      });
    }
    return rows;
  }
  // site data
  function generatetable2(rows, record) {
    const columns = [
      { title: "Site Name", dataIndex: "name" },
      {
        title: "Action",
        key: "x",
        dataIndex: "",
        render: (a) => (
          <Link to={"/locationedit/" + a.id}>
            <Button type="primary">Edit </Button>
          </Link>
        ),
      },
    ];
    return (
      <Table
        size="small"
        className="components-table-demo-nested"
        columns={columns}
        dataSource={rows}
        scroll={{ y: 200 }}
        pagination={false}
      />
    );
  }
  return (
    <>
      <Space>
        <AddRegion />
        <AddArea />
        <Link to="/addsites">
          <Button type="primary">Add Site</Button>
        </Link>
      </Space>
      <Divider type="horizontal" />
      <div class="scroller">
        {/* Display Location Tree data*/}
        <Table
          size="small"
          className="components-table-demo-nested"
          columns={columns}
          dataSource={data1}
          scroll={{ y: 500 }}
          expandable={{
            expandedRowRender: (record) =>
              generatetable(generateusingrecord(record)),
          }}
        />
      </div>
    </>
  );
};
export default LocationList;
