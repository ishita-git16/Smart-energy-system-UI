import React, { useState } from "react";
import { Modal, Button, Col, Row, Form, Input, Space, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const EditChildSubsite = (mydata) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  const { id } = useParams();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = (values, key) => {
    axios({
      method: "PUT",
      data: { sub_site_name: values.subsite_name },
      url: `/modify/subsite?subsite_id=${mydata.mydata.value}`,
    })
      .then((res) => {
        message.success("Subsite Updated successfully!");
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  const onFinishFailed = () => {
    message.warning("Please enter all details");
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit
      </Button>

      <Modal
        title="Update Subsites"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
          scrollToFirstError
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subsite_name"
                label="Subsite Name"
                value="sub_site_name"
                initialValue={mydata.mydata.label}
                rules={[
                  { required: true, message: "Please enter Subsite Name" },
                ]}
              >
                <Input placeholder="Please enter Sub site name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Form.Item>
              <Space>
                <Button
                  type="success"
                  htmlType="submit"
                  style={{
                    background: "green",
                    color: "white",
                  }}
                  onClick={handleOk}
                >
                  Update
                </Button>
                <Button type="danger" onClick={handleCancel}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default EditChildSubsite;
