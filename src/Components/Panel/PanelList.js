import React, { useState, useEffect } from "react";
import { TreeSelect, Table, Button, Input, Space, Select, Spin, Popover,  DatePicker} from "antd";
import axios from "axios";
import { SearchOutlined, StepForwardOutlined, VerticalAlignBottomOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";

// import Search from "antd/lib/transfer/search";

const PanelList = () => {
  const [value, setValue] = useState(undefined);
  const[value1, setValue1] = useState(undefined);
  const [data, setData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [filteredPanelList, setFilteredPanelList] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  // const [user, SetUser] = useState("admin");
  // const [searchVal, setSearchVal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdata, setPdata] = useState([]);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);

  // const { Search } = Input;

  useEffect(() => {
    // API for fetching panel list (all without filtering)
    axios({
      method: "GET",
      url: `/panel/orgid?org_id=${OrgSelection.current_org}`,
    })
      .then((res) => {
        setData(res.data);
        setFilteredPanelList(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    // API for getting Panel Type
    axios({
      method: "GET",

      url: `/getpaneltype`,
    })
      .then((res) => {
        setPdata(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    // API for fetching tree view data
    axios({
      method: "GET",

      url: `/getorg/treeview?org_id=${OrgSelection.current_org}`,
    })
      .then((res) => {
        const treeFormatData = res.data.data.map((region) => {
          return {
            key: "region_" + region.regionid,
            title: region.name,
            children: region.areas.map((area) => {
              return {
                key: "area_" + area.areaid,
                title: area.name,
                children: area.sites.map((site) => {
                  return {
                    key: "site_" + site.siteid,
                    title: site.sitename,
                  };
                }),
              };
            }),
          };
        });

        setTreeData(treeFormatData);
        // setIsLoading2(false);
        setValue(undefined);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [OrgSelection.current_org]);

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

  const columns = [
    {
      // width: 100,
      title: "Panel Name",
      dataIndex: "panelname",
      key: "panelname",
      ...getColumnSearchProps("panelname"),

      sorter: (a, b) => a.panelname.length - b.panelname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      width: 150,
      title: "Panel Number",
      dataIndex: "panelnumber",
      key: "panelnumber",
      ...getColumnSearchProps("panelnumber"),

      sorter: (a, b) => a.panelnumber - b.panelnumber,
      sortDirections: ["descend", "ascend"],
    },
    {
      // width: 100,
      title: "Site /Area /Region",
      dataIndex: ["sitename"],
      key: "sitename",
      // ...getColumnSearchProps("sitename"),
      render: (text, record) => <p >{`${record.sitename}/${record.areaname}/${record.regionname} `} </p>,

      sorter: (a, b) => a.sitename.length + a.areaname.length + a.regionname.length - b.sitename.length + b.areaname.length + b.regionname.length,
      sortDirections: ["descend", "ascend"],
    },
    // {
    //   width: 200,
    //   title: "Area Name",
    //   dataIndex: "areaname",
    //   key: "areaname",
    //   ...getColumnSearchProps("areaname"),
    //   //filteredValue: filteredInfo.name || null,

    //   sorter: (a, b) => a.areaname.length - b.areaname.length,
    //   sortDirections: ["descend", "ascend"],
    // },
    {
      width: 80,
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (a, key) => (
        <div>
          {/* {user === "admin" ? ( */}
          <Space size="middle">
            <Link to={"/paneledit/" + a.panelid}>
              <Button type="primary">Edit</Button>
            </Link>
          </Space>
          {/* ) : null} */}
        </div>
      ),
    },
  ];

  const headers = [
    { label: "Panel Name", key: "panelname" },
    { label: "Panel Number", key: "panelnumber" },
    { label: "Site Name", key: "sitename" },
    { label: "Area Name", key: "areaname" },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const onChange1 = (e) => {
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

  // const onFilterSearch = (e) => {
  //   console.log(e);
  // };

  function onSearch(value) {
    console.log("search:", value);
  }
  const handlePanelChange = (value) => {
    console.log(value);

    setFilteredPanelList(
      data.filter((panel) => {
        return panel.paneltypeid == value;
      })
    );
  };

  if (isLoading) {
    return (
      <div>
        <Space size="middle">
          <Spin
            size="large"
            style={{ marginLeft: "530px", marginTop: "230px" }}
          />
        </Space>
      </div>
    );
  }
  const { Option, OptGroup } = Select;

  return (
    <>
      <div className="filters">
        <h1 style={{ marginTop: "3px" }}>Sites:</h1>

        <TreeSelect
          // showSearch
          style={{
            width: "20%",
            alignItems: "left",
            alignSelf: "left",
            paddingLeft: "10px",
          }}
          value={value}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Select Panel"
          allowClear
          treeDefaultExpandAll
          onChange={onChange1}
          treeData={treeData}
          // onSearch={onFilterSearch}
          treeIcon
        />
        <div style={{ paddingLeft: "10px" }}>
          <Link to="/paneladd">
            <Button type="primary">Add</Button>
          </Link>
        </div>

        <div style={{ paddingLeft: "10px" }}>

          <Popover content="Export selected data">
            <Button type="primary" >
              <CSVLink
                data={filteredPanelList}
                headers={headers}
                filename={"PanelList.csv"}
              >
                <VerticalAlignBottomOutlined />
              </CSVLink>
            </Button>
          </Popover>
        </div>
        {/* </Option> */}
        {/* <Option style={{ color: "black" }} value="Export all data"> */}
        <div style={{ paddingLeft: "10px" }}>
          <Popover content="Export all data">
            <Button type="primary">
              <CSVLink data={filteredPanelList} filename={"Data.csv"}>
                <ArrowDownOutlined />
              </CSVLink>
            </Button>
          </Popover>
          {/* </Option> */}
          {/* </OptGroup> */}
          {/* </Select> */}
        </div>
        {/* Temp comment */}
        <div style={{ paddingLeft: "10px" }}>
          <h1 style={{ marginTop: "3px" }}> Panel Type: </h1>
        </div>
        <div style={{ paddingLeft: "10px" }}>
          <Select
            style={{ width: "110px", height: "32px", textcolor: "black" }}
            onChange={handlePanelChange}
            // showSearch
            allowClear
            // value={filteredPanelList}
            onSearch={onSearch}
          >
            {pdata.map((mdata) => {
              return (
                <Option key={mdata.paneltypeid} value={mdata.paneltypeid}>
                  {mdata.paneltypename}
                </Option>
              );
            })}
          </Select>
        </div>
        <div style={{ paddingLeft: "10px" }}>
          <h1 style={{ marginTop: "3px" }}> Search: </h1>
        </div>
        <div style={{ paddingLeft: "10px" }}>
          <Input.Search
            showSearch
            allowClear
            placeholder="Search Name"
            value={value1}
            enterButton
            onChange={e1 => {
              const currValue = e1.target.value;
              setValue1(currValue);
              const filteredData = data.filter(entry =>
                entry.panelname.toLowerCase().includes(currValue.toLowerCase()) || entry.panelnumber.toLowerCase().includes(currValue.toLowerCase()) || entry.sitename.toLowerCase().includes(currValue.toLowerCase()) || entry.areaname.toLowerCase().includes(currValue.toLowerCase()) || entry.regionname.toLowerCase().includes(currValue.toLowerCase())
              );
              setFilteredPanelList(filteredData);
            }}
          />
        </div>
      </div>
      <br />
      <Table
        columns={columns}
        dataSource={filteredPanelList}
        size="middle"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50],
        }}
        scroll={{ y: 350 }}
      />
    </>
  );
};

export default PanelList;
