import React, { useState, useEffect } from "react";
import { Input, Button, Space, Form } from "antd";
import axios from "axios";
import { Drawer, Row, Col, Descriptions, message } from "antd";
import moment from "moment";
import Bar1 from "../Dashboard/Bar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InputGraph = ({ mydata }) => {
  const [data, setData] = useState();
  const [idata, setInputdata] = useState([]);
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("bottom");
  const [name, setName] = useState();
  
  const keyToTime = (key) => {
    // var time = moment(key.substring(11, 13), ["HH"]).format("hh:mm A");
    var time = moment(key).format(" h:mm");
    var date = moment(key.substring(0, 10), ["YYYY-MM-DD"]).format("MMM DD");
    return [date, time];
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onFinishFailed = () => {
    message.warning("Please enter all details");
  };

  useEffect(() => {
    //API for device data
    const date_ = moment(new Date()).format("YYYY-MM-DD");
    const panelnodata = localStorage.getItem("panelno");
    console.log(mydata);
    axios({
      method: "POST",
      data: {
        panel_no: "000002",
        // `${panelnodata}`,
        // device_code: mydata.device_code,
        // measurement: mydata.measurement,
        // zone: mydata.zone,
        // start_time: `${date_}T00:00:00+05:30`,
        // end_time: `${date_}T23:59:59+05:30`,
        device_code: "MOD01",
        measurement: "energy",
        zone: "KWH",
        start_time: "2021-10-10T00:00:00+05:30",
        end_time: "2021-10-12T00:00:00+05:30",
        aggregate: "difference",
        group_by: "1h",
      },
      url: `/getdevicedata/zone`,
    })
      .then((res) => {
        try {
          function generateData(gdata) {
            var data1 = [];
            for (var i = 0; i < gdata.values.length; i++) {
              var temp = {
                name: keyToTime(gdata.values[i][0]),
                kwh: gdata.values[i][1],
              };
              data1.push(temp);
            }

            return data1;
          }
          var newdata = res.data.results.map((mdata) => {
            return {
              children: mdata.series.map((gdata) => {
                var data = generateData(gdata);
                return {
                  data,
                };
              }),
            };
          });
          setData(newdata[0].children[0].data);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //Api calling for single input
    axios({
      method: "GET",
      url: `getinput/inputid?gen_input_id=${mydata.gen_input_id}`,
    })
      .then((res) => {
        try {
          setInputdata(res.data[0]);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [mydata.gen_input_id]

  );

  const onFinish = (values) => {
    // const mydata = {

    //   areaname: values.name,
    //   areacode: values.id,
     
    // };
    axios({
      method: "PUT",
      data: {
        name: values.name,
        
      },
            
      //   JSON.stringify(mydata),
      url: `/modifyinput/inputid?gen_input_id=${mydata.gen_input_id}`,
    })
      .then((res) => {
        try {
          
          setName(res.config.data);
          message.success("Input Name added successfully!");
        } catch (err) {
          console.log(err);
        }
    
        // history.push(`/location/${OrgSelection.current_org}`);
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };
  
//   useEffect(()=> {
//     fetch(idata);
// }, [idata]);

  function refreshPage() {
    window.location.reload(true);
  }

  return (
    <>
      <Button
        style={{ backgroundColor: "orange" }}
        type="primary"
        onClick={showDrawer}
      >
        Data
      </Button>

      <Drawer
        title={
          <Space>
            Device Code: {mydata.device_code}
            Created Date: {keyToTime(mydata.created_at)}
          </Space>
        }
        placement={placement}
        width={500}
        height={680}
        onClose={onClose}
        visible={visible}
        size="large"
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              style={{ backgroundColor: "green" }}
              type="primary"
              onClick={onClose}
            >
              OK
            </Button>
          </Space>
        }
      >
        <>
       
        <Form
          // {...formItemLayout}
          layout="vertical"
          initialValues={idata}
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // form={form}
          scrollToFirstError
        >
      
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
              initialValues={idata}
                name="name"
                label="Input Name"
                rules={[{ required: true, message: "Please enter Input Name" }]}
              >
                <Input placeholder="Please enter Input Name" />
              </Form.Item>
            </Col>
            
          </Row>
   
        
          <Row gutter={16}>
            <Form.Item >
              <Space>
                <Button
                  type="success"
                  htmlType="submit"
                  style={{
                    background: "green",
                    color: "white",
                  }}
                >
                  Submit
                </Button>
                <Button onClick={refreshPage}>
                  Refresh 
                </Button>
              </Space>
            </Form.Item>
            </Row>
        
        </Form>
         
      
          <Row>
            <Col span={12}>
              <Descriptions
                title="Input Details"
                initialValues={idata}
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 2 }}
                size="small"
              >
                <Descriptions.Item label="Zone">{idata.zone}</Descriptions.Item>
                <Descriptions.Item label="Unique Tag">
                  {idata.unique_tag}
                </Descriptions.Item>
                <Descriptions.Item label="Input Type">
                  {idata.input_type}
                </Descriptions.Item>
                <Descriptions.Item label="Input Name">
                  {idata.name}
                </Descriptions.Item>
                <Descriptions.Item label="Measurement">
                  {idata.measurement}
                </Descriptions.Item>
                <Descriptions.Item label="Device Name">
                  {idata.devicename}
                </Descriptions.Item>
                <Descriptions.Item label="Device Code">
                  {idata.device_code}
                </Descriptions.Item>

                <Descriptions.Item label="Last Updated">
                  {idata.last_updated}
                </Descriptions.Item>
              </Descriptions>
              {/* <Descriptions.Item label="Status" span={3}>
                <Badge status="processing" text="Running" />
              </Descriptions.Item>
              </Descriptions.Item> */}
            </Col>
            <Col span={12}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="kwh"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  {/* <Line type="monotone" dataKey="kwh" stroke="#82ca9d" /> */}
                </LineChart>
                
              </ResponsiveContainer>
            </Col>
            <Col span={12}>
              <Bar1> </Bar1>
            </Col>
          </Row>
        </>
      </Drawer>
    </>
  );
};
export default InputGraph;
