import React, { useState, useEffect } from "react";
import { TreeSelect, Table, Button, Input, Space } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
// import { Pagination } from 'antd';
import OutputEdit from "../Output/OutputEdit"

const OutputList1 = () => {
  const { panelid } = useParams();
  const [value, setValue] = useState(undefined);
  const [data, setData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [filteredPanelList, setFilteredPanelList] = useState(data);

  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  const [user, SetUser] = useState("admin");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            var searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });

              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Unique Tag",
      dataIndex: "unique_tag",
      key: "unique_tag",
      ...getColumnSearchProps("unique_tag"),
      sorter: (a, b) => a.unique_tag.length - b.unique_tag.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Device Output Name",
      dataIndex: "device_output_name",
      key: "org_id",
      ...getColumnSearchProps("device_output_name"),
      sorter: (a, b) =>
        a.device_output_name.length - b.device_output_name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Device Name",
      dataIndex: "name",
      key: "panel_id",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Device Template Code ",
      dataIndex: "device_temp_code",
      key: "output_group_id",
      ...getColumnSearchProps("output_group_id"),
      sorter: (a, b) => a.output_group_id.length - b.output_group_id.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Template",
      dataIndex: "template",
      key: "template",
      ...getColumnSearchProps("template"),
      sorter: (a, b) => a.template.length - b.template.length,
      sortDirections: ["descend", "ascend"],
    },

    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (a) => (
        <div>
          {/* {user === "admin" ? (
            <Link to={"/paneledit/" + a.panelid}>
              <Button type="primary">Edit</Button>
            </Link>
          ) : null} */}
          <OutputEdit {...a}/>
          {/* <Button type="danger">Delete</Button> */}
        </div>
      ),
    },
  ];

  const onChange = (e) => {
    setValue(e);
    if (!e) {
      setFilteredPanelList(data);
      return;
    }
    if (e.split("_")[0] === "site") {
      setFilteredPanelList(
        data.filter((panel) => {
          return panel.siteid == e.split("_")[1];
        })
      );
    }
    if (e.split("_")[0] === "area") {
      setFilteredPanelList(
        data.filter((panel) => {
          return panel.areaid == e.split("_")[1];
        })
      );
    }
    if (e.split("_")[0] === "region") {
      setFilteredPanelList(
        data.filter((panel) => {
          return panel.regionid == e.split("_")[1];
        })
      );
    }
    console.log(filteredPanelList);
  };

  const onFilterSearch = (e) => {
    console.log(e);
  };

  useEffect(() => {
    //API for fetching Device list of current panelid
    axios({
      method: "GET",
      url: `/getoutput/panelid?panelid=${panelid}`,
    })
      .then((res) => {
        setData(res.data);
        setFilteredPanelList(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [OrgSelection.current_org]);

  return (
    <>
      <div
        className="site-layout-background"
        style={{
          padding: 0,
          minHeight: 360,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredPanelList}
          size="small"
          // pagination={{ pageSize: 50 }}
          pagination={{
            defaultPageSize: 4,
            showSizeChanger: true,
            pageSizeOptions: ["4", "3", "2"],
          }}
          // pagination={{ defaultPageSize: 4, showSizeChanger: true, pageSizeOptions: ['4', '3', '2']}}
          scroll={{ y: 400 }}
        />
        {/* <Pagination defaultCurrent={1} total={50}></Pagination> */}
      </div>
    </>
  );
};
export default OutputList1;
