import React, { useState, useEffect } from "react";
import { TreeSelect, Table, Button, Input, Space } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import { Pagination } from "antd";
import InputGraph from "../Input/InputGraph";
// import BarChartData from "../Graph/BarChartData";

const InputList = () => {
  const { panelid } = useParams();
  const [value, setValue] = useState(undefined);
  const [data, setData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [filteredPanelList, setFilteredPanelList] = useState(data);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  const [user, SetUser] = useState("admin");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [devicefilter, SetDevicefilter] = useState(data);
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

  useEffect(() => {
    //API for fetching Device list of current panelid
    axios({
      method: "GET",
      url: `/getinput/panelid?panelid=${panelid}`,
    })
      .then((res) => {
        setData(res.data);
        setFilteredPanelList(res.data);
        const unique = [...new Set(res.data.map((item) => item.device_code))]; // get unique device code
        //console.log(unique);
        const device_filterdata = unique.map((fdata) => {
          return {
            text: fdata,
            value: fdata,
          };
        });
        //console.log(device_filterdata);
        SetDevicefilter(device_filterdata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [OrgSelection.current_org]);

  const columns = [
    {
      width: 50,
      title: "Zone",
      dataIndex: "zone",
      key: "unique_tag",
      ...getColumnSearchProps("zone"),
      sorter: (a, b) => a.zone.length - b.zone.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      width: 170,
      title: "Input Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      width: 50,
      title: "Input Type",
      dataIndex: "input_type",
      key: "panel_id",
      ...getColumnSearchProps("input_type"),
      sorter: (a, b) => a.input_type.length - b.input_type.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      width: 100,
      title: "Unique Tag ",
      dataIndex: "unique_tag",
      key: "unique_tag",
      ...getColumnSearchProps("unique_tag"),
      sorter: (a, b) => a.unique_tag.length - b.unique_tag.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      width: 70,
      title: "Measurement",
      dataIndex: "measurement",
      key: "template",
      ...getColumnSearchProps("measurement"),
      sorter: (a, b) => a.measurement.length - b.measurement.length,
      sortDirections: ["descend", "ascend"],
    },

    {
      width: 60,
      title: "Device Code",
      dataIndex: "device_code",
      key: "device_code",
      filters: devicefilter,
      onFilter: (value, record) => record.device_code.startsWith(value),
      filterSearch: true,
    },

    {
      width: 50,
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (a) => (
        <div>
          {/* {user === "admin" ? ( */}
          <Space size="middle">
            <InputGraph mydata={a} />
          </Space>
        </div>
      ),
    },
  ];

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
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 25, 50],
          }}
          scroll={{ y: 300, x: 100 }}
        />
      </div>
    </>
  );
};
export default InputList;
