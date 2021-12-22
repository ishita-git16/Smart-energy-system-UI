import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import { TreeSelect, Space, Select, DatePicker, Row, Col } from "antd";
import { Card, Statistic } from "antd";
import Bar1 from "./Bar";
import Chart from "./Chart";
import Faults from "./Faults";
import { Button, message, Divider } from "antd";
import { margin } from "@mui/system";
import Speedometer from "./dials/Speedometer";
// import InputMapping from "./InputMapping";

const MainDashboard = () => {
  const [DeviceInputTree, setDeviceInputTree] = useState([]);
  const date_ = moment(new Date()).format("YYYY-MM-DD");
  const [currentSelectedTag, setCurrentSelectedTag] = useState(undefined);
  const [initialSelectedInputs, setinitialSelectedInputs] = useState([]);
  const dates = convert(date_);
  const [startDate, setStartDate] = useState(date_);
  const [endDate, setEndDate] = useState(date_);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [Sitetreedata, setSitetreedata] = useState([]);
  const [value, setValue] = useState(undefined);
  const [currsite, setCurrSite] = useState([]);
  const [tagName, setTagName] = useState([]);
  const [zone, setZone] = useState([]);
  const [measurement, setMeasurement] = useState([]);
  const [singleEnergy, setSingleEnergy] = useState();
  const [tagId, setTagId] = useState();
  const [siteid, setSiteId] = useState();
  const [subsiteid, setSubSiteId] = useState();
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const [newData, setNewdata] = useState();
  // const [voltage, setVoltage] = useState([]);
  // const [current, setCurrent] = useState([]);
  // const [powerFactor, setPowerFactor] = useState([]);
  const [voltageData, setVoltagedata] = useState([]);
  const [currentData, setCurrentdata] = useState([]);
  const [pfdata, setPFdata] = useState([]);

  // let props = {
  //   siteid: `${siteid}`,
  //   subsiteid: `${subsiteid}`

  // }
  const onFilterSearch = (e) => {
    // console.log(e);
  };
  const jsonObj = { "Last 1 day": "John", age: 30, car: null };
  useEffect(() => {
    axios({
      method: "GET",
      url: `/getallsites/organisationid?organisationid=${OrgSelection.current_org}`,
    })
      .then((res) => {
        setCurrSite(res.data);
        // console.log("Mayuri");
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [OrgSelection.current_org, zone, measurement]);

  const handleSiteChange = (value) => {
    console.log(value);
    setSiteId(value);
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: `/getsubsites/siteid?orgid=${OrgSelection.current_org}&siteid=${siteid}`,
    })
      .then((res) => {
        const treeFormatData = res.data.data.map((site) => {
          // setSubSiteId(site.sub_site_id);

          return {
            key: site.sub_site_id,
            // value: site.sub_site_id,
            title: site.sub_site_name,
            children: site.children.map((subsite) => {
              return {
                key: "subsite_" + subsite.child_sub_site_id,
                title: subsite.child_sub_site_name,
              };
            }),
          };
        });
        setSitetreedata(treeFormatData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [siteid]);

  useEffect(() => {
    // axios({
    //   method: "GET",
    //   // url: `/treeview/devices/inputs?siteid=5`,
    //   url: `/treeview/devices/inputs?siteid=${siteid}`,
    // })
    //   .then((res) => {
    //     const tree_data = res.data.data.map((dev) => {
    //       return {
    //         disableCheckbox: true,
    //         selectable: false,
    //         title: `${dev.name}`,
    //         value: `${dev.name}`,
    //         key: `dev_${dev.device_id}`,
    //         children: dev.inputs.map((input) => {
    //           return {
    //             title: `${input.name} / ${input.zone}`,
    //             value: `${input.gen_input_id}`,
    //             key: `inp_${input.gen_input_id}`,
    //           };
    //         }),
    //       };
    //     });
    //     setDeviceInputTree(tree_data);
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // axios({
    //   method: "GET",
    //   // url: `/getmappedinputs/deviceid_tagid?deviceid=1&tagid=1&subsiteid=37`,
    //   url: `/getmappedinputs/deviceid_tagid?tagid=3&subsiteid=${subsiteid}`,
    // })
    //   .then((res) => {
    //     const arr1 = [];
    //     const arr2 = [];
    //     const arr3 = [];
    //     const arr4 = [];
    //     const a= [];
    //     const b =[];
    //     res.data.map((input)=> {
    //       arr1.push(input.zone);
    //       arr2.push(input.measurement);
    //       axios({
    //         method: "POST",
    //         url: `/getdevicedata/zone`,
    //         data:
    //         {
    //           "panel_no": "000005",
    //           "device_code": "MOD02",
    //           "measurement": `${input.measurement}`,
    //           "zone": `${input.zone}`,
    //           "start_time": `${dates}T00:00:00+05:30`,
    //           "end_time": `${dates}T00:00:00+05:30`
    //         }
    //       })
    //         .then((res) => {
    //           console.log(res);
    //           console.log(res.data.results[0].series[0].values);
    //           res.data.results[0].series[0].values.map((kdata) => {
    //             a.push(kdata[1]);
    //           })
    //           console.log(a[0][1]);
    //           setNewdata(a[0][1]);
    //           console.log("I'm a hellooo");
    //           console.log(a);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     })
    //     // b.push(a);
    //      Data(a);
    //     console.log(a);
    //     console.log("Ishita")
    //     console.log(voltageData);
    //     console.log(arr1);
    //     console.log(arr2);
    //     setZone(arr1);
    //     setMeasurement(arr2);
    //     const tree_data = res.data.map((input) => {
    //       return input.gen_input_id.toString();
    //     });
    //     setinitialSelectedInputs(tree_data);
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, [siteid, subsiteid]);

  useEffect(() => {
    // axios({
    //   method: "GET",
    //   // url: `/getmappedinputs/deviceid_tagid?deviceid=1&tagid=1&subsiteid=37`,
    //   url: `/getmappedinputs/deviceid_tagid?tagid=3&subsiteid=${subsiteid}`,
    // })
    //   .then((res) => {
    //     const arr1 = [];
    //     const arr2 = [];
    //     const arr3 = [];
    //     const arr4 = [];
    //     const a= [];
    //     const b =[];
    //     res.data.map((input)=> {
    //       arr1.push(input.zone);
    //       arr2.push(input.measurement);
    //       axios({
    //         method: "POST",
    //         url: `/getdevicedata/zone`,
    //         data:
    //         {
    //           "panel_no": "000005",
    //           "device_code": "MOD02",
    //           "measurement": `${input.measurement}`,
    //           "zone": `${input.zone}`,
    //           "start_time": `${dates}T00:00:00+05:30`,
    //           "end_time": `${dates}T00:00:00+05:30`
    //         }
    //       })
    //         .then((res) => {
    //           console.log(res);
    //           console.log(res.data.results[0].series[0].values);
    //           res.data.results[0].series[0].values.map((kdata) => {
    //             a.push(kdata[1]);
    //           })
    //           console.log(a[0][1]);
    //           setNewdata(a[0][1]);
    //           console.log("I'm a hellooo");
    //           console.log(a);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     })
    //     // b.push(a);
    //     setvoltageData(a);
    //     console.log(a);
    //     console.log("Ishita")
    //     console.log(voltageData);
    //     console.log(arr1);
    //     console.log(arr2);
    //     setZone(arr1);
    //     setMeasurement(arr2);
    //     const tree_data = res.data.map((input) => {
    //       return input.gen_input_id.toString();
    //     });
    //     setinitialSelectedInputs(tree_data);
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, [siteid, subsiteid]);

  // const handleTagChange = (value) => {
  //   console.log(value);
  //   setTagId(value);
  // axios({
  //   method: "POST",

  //   data: {
  //     sub_site_id: `${subsiteid}`,
  //     tag_id: `${value}`,
  //     // from_time: `${startDate}T${startTime}+05:30`,
  //     // to_time: `${endDate}T${endTime}+05:30`,
  //     from_time: "2021-11-24T00:00:00+05:30",
  //     to_time: "2021-11-24T23:59:59+05:30",
  //     group_by: "1d"
  //   },
  //   url: `/processdata/subsite`,
  // })
  // .then((res) => {
  //   var a = "2021-11-24T00:00:00+05:30"
  //   console.log(res.data[a]);
  //   setSingleEnergy(res.data[a]);
  //   // setTagName(res.data);
  // })
  // .catch((err)=> {
  //   console.log(err);
  // });
  // }

  const onSubmit = (value) => {
    setSubSiteId(value);
    console.log("subsite" + `${subsiteid}`);
    axios({
      method: "GET",
      url: `/getmappedinputs/deviceid_tagid?tagid=3&subsiteid=${value}`,
    })
      .then((res) => {
        const arr1 = [];
        const arr2 = [];
        const arr3 = [];
        const arr4 = [];
        const a = [];
        const b = [];
        res.data.map((input) => {
          arr1.push({ key: input.zone, value: input.zone });
          arr2.push(input.measurement);
          axios({
            method: "POST",
            url: `/getdevicedata/zone`,
            data: {
              panel_no: "000005",
              device_code: "MOD02",
              measurement: `${input.measurement}`,
              zone: `${input.zone}`,
              start_time: `${dates}T00:00:00+05:30`,
              end_time: `${dates}T00:00:00+05:30`,
            },
          })
            .then((res) => {
              console.log(res);

              console.log(res.data.results[0].series[0].values);
              res.data.results[0].series[0].values.map((kdata) => {
                a.push({ key: input.zone, value: kdata[1] });
              });
              // console.log(a.value[0][1]);
              // setNewdata(a.value[0][1]);
              console.log("I'm a hellooo Ishitaaa");
              console.log(a);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        // b.push(a);
        setVoltagedata(a);

        console.log(a);
        console.log("Ishita");
        console.log(voltageData);

        console.log(arr1);
        console.log(arr2);
        setZone(arr1);
        setMeasurement(arr2);

        // const tree_data = res.data.map((input) => {
        //   return input.gen_input_id.toString();
        // });

        // setinitialSelectedInputs(tree_data);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // get current data

    axios({
      method: "GET",
      url: `/getmappedinputs/deviceid_tagid?tagid=4&subsiteid=${value}`,
    })
      .then((res) => {
        const arr1 = [];
        const arr2 = [];
        const arr3 = [];
        const arr4 = [];
        const a = [];
        const b = [];
        res.data.map((input) => {
          arr1.push(input.zone);
          arr2.push(input.measurement);
          axios({
            method: "POST",
            url: `/getdevicedata/zone`,
            data: {
              panel_no: "000005",
              device_code: "MOD02",
              measurement: `${input.measurement}`,
              zone: `${input.zone}`,
              start_time: `${dates}T00:00:00+05:30`,
              end_time: `${dates}T00:00:00+05:30`,
            },
          })
            .then((res) => {
              console.log(res);

              console.log(res.data.results[0].series[0].values);
              res.data.results[0].series[0].values.map((kdata) => {
                a.push({ key: input.zone, value: kdata[1] });
              });
              console.log(a[0][1]);
              setNewdata(a[0][1]);
              console.log("I'm a hellooo");
              console.log(a);
            })
            .catch((err) => {
              console.log(err);
            });
        });

        setCurrentdata(a);

        console.log(a);
        console.log("Ishita");
        console.log(currentData);

        console.log(arr1);
        console.log(arr2);
        setZone(arr1);
        setMeasurement(arr2);
      })
      .catch((err) => {
        console.log(err);
      });

    //getting power factor data
    axios({
      method: "GET",
      url: `/getmappedinputs/deviceid_tagid?tagid=5&subsiteid=${value}`,
    })
      .then((res) => {
        const arr1 = [];
        const arr2 = [];
        const arr3 = [];
        const arr4 = [];
        const a = [];
        const b = [];
        res.data.map((input) => {
          arr1.push(input.zone);
          arr2.push(input.measurement);
          axios({
            method: "POST",
            url: `/getdevicedata/zone`,
            data: {
              panel_no: "000005",
              device_code: "MOD02",
              measurement: `${input.measurement}`,
              zone: `${input.zone}`,
              start_time: `${dates}T00:00:00+05:30`,
              end_time: `${dates}T00:00:00+05:30`,
            },
          })
            .then((res) => {
              console.log(res);

              console.log(res.data.results[0].series[0].values);
              res.data.results[0].series[0].values.map((kdata) => {
                a.push({ key: input.zone, value: kdata[1] });
              });
              console.log(a[0][1]);
              setNewdata(a[0][1]);

              console.log(a);
            })
            .catch((err) => {
              console.log(err);
            });
        });

        setPFdata(a);

        console.log(a);

        console.log(pfdata);

        console.log(arr1);
        console.log(arr2);
        setZone(arr1);
        setMeasurement(arr2);
      })
      .catch((err) => {
        console.log(err);
      });
    // axios({
    //   method: "POST",
    //   data: initialSelectedInputs.map((id) => {
    //     return {
    //       subsite_id: `${subsiteid}`,
    //       input_id: id,
    //       tag_id: "1",
    //     };
    //   }),
    //   url: `/mapping/subsite_with_input`,
    // })
    //   .then((res) => {
    //     message.success("Inputs added successfully!");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     message.error(err.message);
    //   });
  };
  const onDeviceInputTreeChange = (e) => {
    setinitialSelectedInputs(e);
    console.log(e);
  };
  const onChange1 = (date) => {
    console.log(convert(date_));
    console.log(date[0]._d);
    console.log(date[1]._d);
    console.log(convert(date[0]._d));
    setStartDate(convert(date[0]._d));
    console.log(convert(date[1]._d));
    setEndDate(convert(date[1]._d));
    console.log(date[0]._d.toTimeString().split(" ")[0]);
    setStartTime(date[0]._d.toTimeString().split(" ")[0]);
    console.log(date[1]._d.toTimeString().split(" ")[0]);
    setEndTime(date[1]._d.toTimeString().split(" ")[0]);
    // setDates(convert(date));
  };
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  function disabledDate(current) {
    // Can not select days before today and today
    return current > moment().endOf("day");
  }
  function onSearch(value) {
    console.log("search:", value);
  }
  // temp comment instead we are using onSubmit
  // const onChange4 = (value) => {
  //   console.log("SUBSITE" + value);
  //   setSubSiteId(value);
  //   axios({
  //     method: "POST",

  //     data: {
  //       sub_site_id: `${subsiteid}`,
  //       // tag_id: `${tagId}`,
  //       tag_id: "1",
  //       from_time: `${dates}T00:00:00+05:30`,
  //       to_time: `${dates}T23:59:59+05:30`,
  //       group_by: "1d",
  //       // from_time: `${startDate}T${startTime}+05:30`,
  //       // to_time: `${startDate}T${startTime}+05:30`,
  //       // to_time: `${endDate}T${endTime}+05:30`,
  //     },
  //     url: `/processdata/subsite`,
  //   })
  //     .then((res) => {
  //       // const newList = [];
  //       // res.data.map((kdata)=> {

  //       // })
  //       // var a = `${startDate}T${startTime}+05:30`
  //       // var a = `${startDate}T00:00:00+05:30`
  //       var a = `${dates}T00:00:00+05:30`;
  //       console.log(dates);
  //       console.log(res.data);
  //       setSingleEnergy(res.data[a]);
  //       // setTagName(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const onChange5 = (value) => {
  // axios({
  //   method: "POST",
  //   data: {
  //     sub_site_id: `${subsiteid}`,
  //     tag_id: `${tagId}`,
  //     from_time: `${dates}T00:00:00+05:30`,
  //     to_time: `${dates}T23:59:59+05:30`,
  //     // from_time: `${startDate}T${startTime}+05:30`,
  //     // to_time: `${startDate}T${startTime}+05:30`,
  //     // to_time: `${endDate}T${endTime}+05:30`,
  //     group_by: "1d"
  //   },
  //   url: `/processdata/subsite`,
  // })
  //   .then((res) => {
  //     const newList = [];
  //     // res.data.map((kdata)=> {
  //     // })
  //     // var a = `${startDate}T${startTime}+05:30`
  //     // var a = `${startDate}T00:00:00+05:30`
  //     var a = `${dates}T00:00:00+05:30`
  //     console.log(res.data[a]);
  //     setSingleEnergy(res.data[a]);
  //     // setTagName(res.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // };
  return (
    <>
      <Space>
        Site
        <Select
          style={{
            width: "150px",
          }}
          onSearch={onSearch}
          onChange={handleSiteChange}
        >
          {currsite.map((mdata) => {
            return (
              <Option key={mdata.siteid} value={mdata.siteid}>
                {mdata.sitename}
              </Option>
            );
          })}
        </Select>
        Subsite
        <TreeSelect
          showSearch
          style={{
            width: "100%",
            alignItems: "left",
            alignSelf: "left",
            paddingLeft: "10px",
          }}
          // value={subsiteid}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Select Subsite"
          allowClear
          onChange={onSubmit}
          treeData={Sitetreedata}
          onSearch={onFilterSearch}
          treeIcon
        />
        {/* <TreeSelect
          style={{ width: "200px", height: "32px", textcolor: "black" }}
          treeData={DeviceInputTree}
          treeCheckable
          value={initialSelectedInputs}
          onChange={onDeviceInputTreeChange}
        />
        <Button
          htmlType="submit"
          // onClick={onSubmit}
          type="primary"
        >
          Add
        </Button> */}
        {/* Tag
        <Select
          style={{
            width: "150px",
          }}
          onSearch={onSearch}
          onChange={handleTagChange}
        >
          {tagName.map((mdata) => {
            return (
              <Option key={mdata.tag_id} value={mdata.tag_id}>
                {mdata.tag_name}
              </Option>
            );
          })}
        </Select> */}
        {/* Date
        <RangePicker
          // showTime
          // bordered={false}
          disabledDate={disabledDate}
          defaultValue={[
            //todo
            moment(startDate, "YYYY-MM-DD"),
            moment(endDate, "YYYY-MM-DD"),
          ]}
          disabled={[false, true]}
          onChange={onChange1} /> */}
        {/* <Button type="primary" onClick={onChange5}>Submit</Button > */}
      </Space>
      <Row gutter={[95]}>
        <Space>
          <Col>
            <Card
              title="Voltage"
              bordered={false}
              style={{ width: 300, marginTop: "20px" }}
            >
              <Space>
                {voltageData.map((kdata) => {
                  return (
                    <Statistic
                      title={
                        <h1 style={{ fontWeight: "bold" }}>{kdata.key}</h1>
                      }
                      value={Math.round(kdata.value)}
                      valueStyle={{ color: "#3f8600" }}
                      suffix="V"
                    />
                  );
                })}
              </Space>
            </Card>
          </Col>

          <Col>
            <Card
              title="Current"
              bordered={false}
              style={{ width: 300, marginTop: "20px" }}
            >
              <Space>
                {currentData.map((kdata) => {
                  return (
                    <Statistic
                      title={
                        <h1 style={{ fontWeight: "bold" }}>{kdata.key}</h1>
                      }
                      value={kdata.value}
                      valueStyle={{ color: "#3f8600" }}
                      suffix="A"
                    />
                  );
                })}
              </Space>
            </Card>
          </Col>

          <Col>
            <Card
              title="Power Factor"
              bordered={false}
              style={{ width: 300, marginTop: "20px" }}
            >
              <Space>
                {pfdata.map((kdata) => {
                  return (
                    <Statistic
                      title={
                        <h1 style={{ fontWeight: "bold" }}>{kdata.key}</h1>
                      }
                      value={kdata.value}
                      valueStyle={{ color: "#3f8600" }}
                      suffix=" "
                    />
                  );
                })}
              </Space>
            </Card>
          </Col>
        </Space>
      </Row>
      <Row gutter={[95]}>
        <Space>
          <div className="site-card-border-less-wrapper">
            <Card
              title="Power Consumption"
              bordered={false}
              style={{ width: 540, marginTop: "20px", marginLeft: "46px" }}
            >
              <Chart />
            </Card>
          </div>
          <Card
            title="Faults"
            bordered={false}
            style={{ width: 540, marginTop: "20px", marginLeft: "16px" }}
          >
            <Faults />
          </Card>
        </Space>
      </Row>
      <Row gutter={[95]}>
        <Space>
          <Card
            title="Energy Consumption"
            bordered={false}
            style={{ width: 1080, marginTop: "20px", marginLeft: "46px" }}
          >
            <Bar1 />
          </Card>
        </Space>
      </Row>
      <Row gutter={[15]}>
        <Space>
          <Col>
            <Card
              title="DG Battery"
              bordered={false}
              style={{ width: 250, marginTop: "20px" }}
            >
              <Speedometer
                id="dial5"
                value={25}
                measurement="Voltage"
                forValue="DGBattery"
                title="Voltage"
              />
            </Card>
          </Col>
          <Col>
            <Card
              title="DG Fuel"
              bordered={false}
              style={{ width: 250, marginTop: "20px" }}
            >
              <Speedometer
                id="dial5"
                value={56}
                measurement="Percentage"
                forValue="DGFuel"
                title="Fuel"
              />
            </Card>
          </Col>
          <Col>
            <Card
              title="UPS Battery"
              bordered={false}
              style={{ width: 250, marginTop: "20px" }}
            >
              <Speedometer
                id="dial5"
                value={350}
                measurement="Voltage"
                forValue="UPSBattery"
                title="Voltage"
              />
            </Card>
          </Col>
          <Col>
            <Card
              title="UPS Load"
              bordered={false}
              style={{ width: 250, marginTop: "20px" }}
            >
              <Speedometer
                id="dial5"
                value={20}
                measurement="Percentage"
                forValue="UPSLoad"
                title="Load"
              />
            </Card>
          </Col>
        </Space>
      </Row>
    </>
  );
};
export default MainDashboard;
