import { Space, Form, Input, Button, Select, Modal } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

const OutputEdit = ({ ...a }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  // useEffect(() => {
  //   axios({
  //     method: "GET",

  //     url: `/devices/deviceid?deviceid=${a.device_id}   `,
  //   })
  //     .then((res) => {
  //       form.setFieldsValue({
  //         device_id: res.data.device_id,
  //         device_code: res.data.device_code,
  //         name: res.data.name,
  //         device_health_status: res.data.device_health_status,
  //         a_panel_number: res.data.a_panel_number,
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const { Option } = Select;
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit
      </Button>
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          hideRequiredMark
          //  onFinishFailed={onFinishFailed}
          initialValues={a}
          name="control-hooks"
          onFinish={onFinish}
        >
          <Form.Item
            name="unique_tag"
            label="Unique Tag"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="device_output_name"
            label="Device Output Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Device Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            name="device_health_status"
            label="Health Status"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            name="device_temp_code"
            label="Device Template Code"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: "40px", background: "green" }}
            >
              Submit
            </Button>
            <Space />
            {/* <Button key="back" onClick={handleCancel} style={{background: "red", color: "white"}}>
              Cancel
        </Button> */}

            {/* <Button type="primary" onClick={onFill} style={{ marginLeft: "5px"}}>
          Fill form
        </Button> */}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OutputEdit;
