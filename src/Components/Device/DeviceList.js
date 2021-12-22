import React, { useState, useEffect } from "react";
import Demo from "./DeviceEdit";
import { Table, Button, Input, Space } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import DeviceEdit from "../Device/DeviceEdit";

const DevicelList = () => {
  const { panelid } = useParams();
  const [value, setValue] = useState(undefined);
  const [data, setData] = useState([]);
  // const [treeData, setTreeData] = useState([]);
  const [filteredPanelList, setFilteredPanelList] = useState(data);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  // const [user, SetUser] = useState("admin");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      title: "Device Code",
      dataIndex: "device_code",
      key: "device_code",
      ...getColumnSearchProps("device_code"),
      sorter: (a, b) => a.device_code.length - b.device_code.length,
      sortDirections: ["descend", "ascend"],
      // width: 50,
    },
    {
      title: "Device Name",
      dataIndex: "name",
      key: "name_",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name_.length - b.name_.length,
      sortDirections: ["descend", "ascend"],
      // width: 50,
    },
    {
      title: "Device Type",
      dataIndex: "device_type",
      key: "device_type",
      ...getColumnSearchProps("device_type"),
      sorter: (a, b) =>
        a.device_health_status.length - b.device_health_status.length,
      sortDirections: ["descend", "ascend"],
      // width: 50,
    },
    // {
    //   title: "Health Status",
    //   dataIndex: "device_health_status",
    //   key: "device_health_status",
    //   ...getColumnSearchProps("device_health_status"),
    //   sorter: (a, b) =>
    //     a.device_health_status.length - b.device_health_status.length,
    //   sortDirections: ["descend", "ascend"],
    //   // width: 50,
    // },
    // {
    //   title: "Health Status",
    //   dataIndex: "device_health_status",
    //   key: "device_health_status",
    //   ...getColumnSearchProps("device_health_status"),
    //   sorter: (a, b) =>
    //     a.device_health_status.length - b.device_health_status.length,
    //   sortDirections: ["descend", "ascend"],

    // },

    {
      title: "Action",
      width: 100,
      align: "center",
      dataIndex: "",
      key: "x",
      render: (a) => <DeviceEdit {...a} />,
    },
  ];

  useEffect(() => {
    //API for fetching Device list of current panelid
    axios({
      method: "GET",
      url: `/getdevices/panelid?panelid=${panelid}`,
      // ${panelid}
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
        style={{ padding: 24, minHeight: 360 }}
      >
        <Table
          columns={columns}
          dataSource={filteredPanelList}
          size="small"
          pagination={{ pageSize: 50 }}
          hideOnSinglePage={true}
          scroll={{ y: 400 }}
        />
      </div>
    </>
  );
};
export default DevicelList;
