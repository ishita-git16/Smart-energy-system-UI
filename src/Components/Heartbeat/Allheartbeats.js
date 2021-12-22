import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import HeartbeatRow from "../common/HeartbeatRow";
import Hbrow4 from "../common/Hbrow4";
import { useSelector } from "react-redux";
import { Select, TreeSelect, Space, Typography, Popover } from "antd";
import { DatePicker, Descriptions } from "antd";
// import Hbrow4 from "../common/Hbrow4";
const HeartbeatHeaders1 = ["Panel Name"];
// const  HeartbeatHeaders = (hdata) => {
//   const arr = [];
//   {hdata.map((headers) => {
//     arr.push(headers.date_time.split(" ", 2)[1]);
//     return arr;
//   })}
//  }
const HeartbeatHeaders = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const Allheartbeats = () => {
  const date_ = moment(new Date()).format("YYYY-MM-DD");
  const [pdata, setPdata] = useState([]);
  const [value, setValue] = useState(undefined);
  const [dates, setDates] = useState(date_);
  const [data, setData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [filteredPanelList, setFilteredPanelList] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [user, SetUser] = useState("admin");
  const [searchVal, setSearchVal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);

  const { Option, OptGroup } = Select;
  // const [panelData, setPanelData] = useState({});
  useEffect(() => {
    //API for fetching panel list (all without filtering)

    //API for fetching Panel Types
    axios({
      method: "GET",

      url: `/getpaneltype`,
    })
      .then((res) => {
        // setData(res.data);
        // setFilteredPanelList(res.data);
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
  }, [OrgSelection.current_org]);

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

  const onChange1 = (date) => {
    console.log(convert(date));
    setDates(convert(date));
  };
  // setDates({dateString});
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  const onFilterSearch = (e) => {
    // console.log(e);
  };

  function onSearch(value) {
    console.log("search:", value);
  }
  const handlePanelChange = (value) => {
    console.log(value);
    // if(value == 4){
    setFilteredPanelList(
      data.filter((panel) => {
        return panel.paneltypeid == value;
      })
    );
    // }
  };

  console.log(dates);

  return (
    <>
      <Space>
        <div>
          <h1 style={{ marginTop: "6px" }}>Sites:</h1>
        </div>
        <div className="filters">
          <TreeSelect
            showSearch
            style={{
              width: "200px",
              alignItems: "left",
              alignSelf: "left",
              paddingLeft: "10px",
            }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Select Panel"
            allowClear
            //   treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
            onSearch={onFilterSearch}
            treeIcon
          />
        </div>
        <div>
          <h1 style={{ marginTop: "6px" }}>Date:</h1>
        </div>

        <DatePicker onChange={onChange1} />
        {/* <DatePicker placeholder={dates} onChange={onChange1} /> */}
        <div style={{ paddingLeft: "10px" }}>
          <h1 style={{ marginTop: "3px" }}> Panel Type: </h1>
        </div>
        <div style={{ paddingLeft: "10px" }}>
          <Select
            style={{ width: "110px", height: "32px", textcolor: "black" }}
            onChange={handlePanelChange}
            // value={filteredPanelList}
            onSearch={onSearch}
          >
            {/* {pdata.map(mdata =>
               return(
                <Option
                //  key={mdata.paneltypeid} value={mdata.paneltypeid}
                 >
                {mdata.paneltypename}
                </Option>
              ))} */}
            {pdata.map((mdata) => {
              return (
                <Option key={mdata.paneltypeid} value={mdata.paneltypeid}>
                  {mdata.paneltypename}
                </Option>
              );
            })}
          </Select>
        </div>
      </Space>
      <br />

      <Typography.Title level={4} style={{ marginLeft: "400px" }}>
        Hourly Heartbeat Count
      </Typography.Title>
      <div class="scroller">
        <div class="table1">
          <table border="1px" width="100%" height="20%">
            <tr>
              {HeartbeatHeaders1.map((hdata) => {
                return <th>{hdata}</th>;
              })}
            </tr>
            {filteredPanelList.map((mdata) => {
              return (
                <tr>
                  {/* <Popover content = {content2}>  */}
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      height: "15px",
                    }}
                  >
                    {mdata.panelname}{" "}
                  </td>
                  {/* </Popover> */}
                </tr>
              );
            })}
          </table>
        </div>
        <div class="table2">
          <table border="1px" width="200%">
            <tr>
              {HeartbeatHeaders.map((hdata) => {
                return <th>{hdata}</th>;
              })}
            </tr>
            {/* let props ={
                  a: mdata,
                  b: dates
                } */}
            {filteredPanelList.map((mdata) => {
              var props = {
                dates: { dates },
                mdata: { mdata },
                // pdata: {pdata}
              };
              if (mdata.paneltypeid == 1) {
                return (
                  <>
                    <HeartbeatRow {...props} />
                  </>
                );
              } else {
                return (
                  <>
                    <Hbrow4 {...props} />
                  </>
                );
              }
            })}
          </table>
        </div>
      </div>
    </>
  );
};

export default Allheartbeats;
