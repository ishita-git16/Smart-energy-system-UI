// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Button,
//   Col,
//   Row,
//   Form,
//   Space,
//   message,
//   Transfer,
//   Select,
//   Drawer,
// } from "antd";
// import axios from "axios";
// import "antd/dist/antd.css";
// import { useParams } from "react-router-dom";
// const { Option } = Select;
// const mockData = [];
// const mockData1 = [];

// const myData = () => {
//   axios
//     .get(
//       "http://192.168.1.239:5511/getmappedinputs/deviceid_tagid?deviceid=290&tagid=1&subsiteid=38"
//     )
//     .then((response) => {
//       console.log(response);
//       for (let i = 0; i < response.data.length; i++) {
//         mockData1.push({
//           key: response.data[i].gen_input_id,
//           title: response.data[i].name,
//           description: response.data[i].name,
//         });
//       }
//     });
//   return mockData1;
// };
// myData();
// const initialTargetKeys = mockData1.map((item) => item.key);
// console.log(initialTargetKeys);

// const AddInputToSite = () => {
//   const [form] = Form.useForm();

//   const { id } = useParams();
//   const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
//   const [panelid, setPanelid] = useState();
//   const [inputdata, setInputData] = useState([]);
//   const [devicedata, setDevicedata] = useState([]);
//   const [selectedKeys, setSelectedKeys] = useState([]);
//   const [tagdata, setTagdata] = useState([]);
//   const [currenttagid, setCurrent_tagid] = useState();
//   const [currentdeviceid, setCurrentDeviceid] = useState();
//   const [unmappedsourcedata, setUnmappedSourcedata] = useState([]);
//   const [mappedsourcedata, setMmappedSourcedata] = useState([]);
//   const [visible, setVisible] = useState(false);
//   const [currentMethod, setCurrentMethod] = useState();
//   const [currentOperation, setCurrentOperation] = useState();

//   const onScroll = (direction, e) => {
//     console.log("direction:", direction);
//     console.log("target:", e.target);
//   };
//   function onDeviceChange(value) {
//     console.log(`selected ${value}`);
//     setCurrentDeviceid(value);
//   }
//   function onTagChange(value) {
//     console.log(`selected ${value}`);
//     setCurrent_tagid(value);
//   }

//   const showDrawer = () => {
//     setVisible(true);
//   };

//   const onClose = () => {
//     setVisible(false);
//   };

//   useEffect(() => {
//     axios({
//       method: "GET",
//       url: `/panelid/siteid?siteid=${id}`,
//     })
//       .then((res) => {
//         setPanelid(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     //fetching device id by panel id
//     axios({
//       method: "GET",
//       // url: `/getdevices/panelid?panelid=${panelid}`,
//       url: `/getdevices/panelid?panelid=781`,
//     })
//       .then((res) => {
//         setDevicedata(res.data);
//         console.log(res.data);
//       })

//       .catch((err) => {
//         console.log(err);
//       });
//     // get input name by device id, tag id ,subsite id
//     axios({
//       method: "GET",
//       url: `/getunmappedinputs/deviceid_tagid?deviceid=${currentdeviceid}&tagid=${currenttagid}&subsiteid=220`,
//     })
//       .then((res) => {
//         for (let i = 0; i < res.data.length; i++) {
//           mockData.push({
//             key: res.data[i].gen_input_id,
//             title: res.data[i].name,
//             description: res.data[i].name,
//           });
//         }
//         setUnmappedSourcedata(res.data);
//         console.log(res.data);
//       })

//       .catch((err) => {
//         console.log(err);
//       });
//     // get mapped data
//     // axios({
//     //   method: "GET",
//     //   // url: `/getmappedinputs/deviceid_tagid?deviceid=${currentdeviceid}&tagid=${currenttagid}&subsiteid=220`,
//     //   url: `getmappedinputs/deviceid_tagid?deviceid=290&tagid=1&subsiteid=38`,
//     // })
//     //   .then((res) => {
//     //     const abc = res.data.map((item) => item.gen_input_id);
//     //     setMmappedSourcedata(res.data);
//     //     // setInitialTargetkey(abc);
//     //   })

//     //   .catch((err) => {
//     //     console.log(err);
//     //   });

//     //fetching Tags
//     axios({
//       method: "GET",
//       url: `/input_tags`,
//     })
//       .then((res) => {
//         setTagdata(res.data);
//         console.log(res.data);
//       })

//       .catch((err) => {
//         console.log(err);
//       });
//   }, [panelid, currentdeviceid, currenttagid]);

//   const onChange = (nextTargetKeys, direction, moveKeys) => {
//     console.log("targetKeys:", nextTargetKeys);
//     console.log("direction:", direction);
//     console.log("moveKeys:", moveKeys);
//     setTargetKeys(nextTargetKeys);
//   };

//   const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
//     console.log("sourceSelectedKeys:", sourceSelectedKeys);
//     console.log("targetSelectedKeys:", targetSelectedKeys);
//     setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
//   };

//   const onFinish = (values, key) => {
//     axios({
//       method: "POST",
//       data: generatedata(values, id, currenttagid),
//       //   data: {
//       //     subsite_id: id,
//       //     input_id: values.subsite_name,
//       //     tag_id: 0,
//       //   },

//       url: `/mapping/subsite_with_input?method=${currentMethod}&operator=${currentOperation}`,
//     })
//       .then((res) => {
//         message.success("Subsite added successfully!");
//       })
//       .catch((err) => {
//         console.log(err);
//         message.error(err.message);
//       });
//   };

//   const onFinishFailed = () => {
//     message.warning("Please enter all details");
//   };
//   function onMethodChange(value) {
//     setCurrentMethod(value);
//     console.log(`selected ${value}`);
//   }
//   function onOperationChange(value) {
//     setCurrentOperation(value);
//     console.log(`selected ${value}`);
//   }

//   return (
//     <>
//       <Button type="primary" onClick={showDrawer}>
//         Add Inputs
//       </Button>

//       <Drawer
//         title="Add Inputs"
//         placement="right"
//         onClose={onClose}
//         width={600}
//         visible={visible}
//       >
//         <Col>
//           <Row>
//             <Space>
//               Select Device
//               <Select
//                 style={{ width: "110px", height: "32px", textcolor: "black" }}
//                 onChange={onDeviceChange}
//               >
//                 {devicedata.map((mdata) => {
//                   return (
//                     <Option key={mdata.device_id} value={mdata.device_id}>
//                       {mdata.name}
//                       {/* {mdata.device_id} */}
//                     </Option>
//                   );
//                 })}
//               </Select>
//               Select Tag
//               <Select
//                 style={{ width: "110px", height: "32px", textcolor: "black" }}
//                 onChange={onTagChange}
//               >
//                 {tagdata.map((mdata) => {
//                   return (
//                     <Option key={mdata.tag_id} value={mdata.tag_id}>
//                       {mdata.tag_name}
//                       {/* {mdata.tag_id} */}
//                     </Option>
//                   );
//                 })}
//               </Select>
//             </Space>
//           </Row>
//           <br></br>
//           <Row>
//             <Space>
//               Method
//               <Select
//                 showSearch
//                 style={{ width: 200 }}
//                 placeholder="Search to Select"
//                 onChange={onMethodChange}
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option.children.toLowerCase().indexOf(input.toLowerCase()) >=
//                   0
//                 }
//                 filterSort={(optionA, optionB) =>
//                   optionA.children
//                     .toLowerCase()
//                     .localeCompare(optionB.children.toLowerCase())
//                 }
//               >
//                 <Option value="jack">Jack</Option>
//                 <Option value="lucy">Lucy</Option>
//                 <Option value="tom">Tom</Option>
//               </Select>
//               Operations
//               <Select
//                 showSearch
//                 style={{ width: 200 }}
//                 placeholder="Search to Select"
//                 onChange={onOperationChange}
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option.children.toLowerCase().indexOf(input.toLowerCase()) >=
//                   0
//                 }
//                 filterSort={(optionA, optionB) =>
//                   optionA.children
//                     .toLowerCase()
//                     .localeCompare(optionB.children.toLowerCase())
//                 }
//               >
//                 <Option value="jack">Jack</Option>
//                 <Option value="lucy">Lucy</Option>
//                 <Option value="tom">Tom</Option>
//               </Select>
//             </Space>
//           </Row>
//         </Col>
//         <br></br>
//         <br></br>
//         <Form
//           layout="vertical"
//           hideRequiredMark
//           onFinish={onFinish}
//           onFinishFailed={onFinishFailed}
//           form={form}
//           scrollToFirstError
//         >
//           <Row gutter={16}>
//             <Col span={12}>
//               {/* <h2 style={{marginLeft: "200px"}}> Inputs</h2> */}
//               <br></br>
//               <Form.Item
//                 name="input_id"
//                 label="Inputs"
//                 rules={[{ required: true, message: "Please Select Inputs" }]}
//               >
//                 <Transfer
//                   showSearch
//                   dataSource={mockData}
//                   titles={["Source", "Target"]}
//                   targetKeys={targetKeys}
//                   style={{ marginLeft: "100px" }}
//                   selectedKeys={selectedKeys}
//                   onChange={onChange}
//                   onSelectChange={onSelectChange}
//                   onScroll={onScroll}
//                   render={(item) => item.title}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Form.Item>
//               <Space>
//                 <Button
//                   type="success"
//                   htmlType="submit"
//                   style={{
//                     background: "green",
//                     color: "white",
//                     marginLeft: "240px",
//                   }}
//                   // onClick={handleOk}
//                 >
//                   Add
//                 </Button>
//               </Space>
//             </Form.Item>
//           </Row>
//         </Form>
//       </Drawer>
//     </>
//   );
// };

// function generatedata(values, id, currenttagid) {
//   var to_return = [];

//   for (var i = 0; i < values.input_id.length; i++) {
//     to_return.push({
//       subsite_id: id,
//       input_id: values.input_id[i],
//       tag_id: currenttagid,
//     });
//   }

//   return to_return;
// }

// export default AddInputToSite;
