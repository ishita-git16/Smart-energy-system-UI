import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
  Descriptions,
  Button,
  Input,
  Space,
  Col,
  Row,
  Form,
  message
} from "antd";

const SiteEdit = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  // const handleOk = () => {
  //   setIsModalVisible(false);
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };
  // useEffect(() => form.resetFields(), [initialvalues]);
  useEffect(() => {
    // get region data
    axios({
      method: "GET",
      url: `/getsite/siteid?siteid=${id}`,
    })
      .then((res) => {
        setData(res.data);
      
      })
      .catch((err) => {
        console.log(err);
      });
  }, [OrgSelection.current_org]);

  const onFinishFailed = () => {
    message.warning("Please enter all details");
  };

  const onFinish = (values) => {
   
    axios({
      method: "PUT",
      data: {
        sitename: values.sitename,
        description: values.description,
        addressline1: values.addressline1,
        addressline2: values.addressline2,
        longitude: values.longitude,
        latitude: values.latitude,
        sitecode: values.sitecode,
        regionid: values.regionid,
        areaid: values.areaid
      },
            
      //   JSON.stringify(mydata),
      url: `/modify/site?siteid=${id}`,
    })
      .then((res) => {
        try {
          message.success("Site Name updated successfully!");
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
  form.setFieldsValue({
    sitename: data.sitename,
    sitecode: data.sitecode
    // username: data.username
});
  return (
    <>
    <Form
            // {...formItemLayout}
            layout="vertical"
            initialValues={data}
            hideRequiredMark
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
            scrollToFirstError
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  initialValues={data.sitename}
                  name="sitename"
                  value="sitename"
                  label="Site Name"
                  rules={[
                    { required: true, message: "Please enter Site Name" },
                  ]}
                >
                  <Input placeholder={data.sitename} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  initialValues={data.sitecode}
                  name="sitecode"
                  label="Site Code"
                  value="sitecode"
                  rules={[
                    { required: true, message: "Please enter Site Code" },
                  ]}
                >
                  <Input placeholder={data.sitecode} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
                          
            <Row gutter={16}></Row>
              <Form.Item {...tailFormItemLayout}>
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
                  {/* <Button type="danger" >
                    Cancel
                  </Button> */}
                </Space>
              </Form.Item>
            </Row>
          </Form>
      <Descriptions
        title="Site Details"
        bordered
        column={{ xxl: 2, xl: 2, lg: 1, md: 2, sm: 2, xs: 2 }}
      >
        <Descriptions.Item label="Site Name">{data.sitename}</Descriptions.Item>
        {/* <Descriptions.Item label="Description">{data.description}</Descriptions.Item>
        <Descriptions.Item label="Address Line1 ">{data.addressline1}</Descriptions.Item>
        <Descriptions.Item label="Address Line2">{data.addressline2}</Descriptions.Item>
        <Descriptions.Item label="Longitude">{data.longitude}</Descriptions.Item>
        <Descriptions.Item label="Latitude">{data.latitude}</Descriptions.Item> */}
        <Descriptions.Item label="Site Code">{data.sitecode}</Descriptions.Item>
        {/* <Descriptions.Item label="Region ID">{data.regionid}</Descriptions.Item>
        <Descriptions.Item label="Area ID">{data.areaid}</Descriptions.Item> */}
        

        {/* <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
        <Descriptions.Item label="Status" span={3}>
          <Badge status="processing" text="Running" />
        </Descriptions.Item>
        <Descriptions.Item label="Negotiated Amount">$80.00</Descriptions.Item>
        <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
        <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item> */}
      </Descriptions>
    </>
  );
};
export default SiteEdit;
