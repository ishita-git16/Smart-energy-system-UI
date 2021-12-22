import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Select,
  Col,
  Row,
  Form,
  message,
  Modal,
} from "antd";
import { useSelector } from "react-redux";
import axios from "axios";

const AreaEdit = ({ ...a }) => {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);
  const [regiontreedata, setRegionTreedata] = useState([]);
  const [value, setValue] = useState(undefined);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    // get city data
    axios({
      method: "GET",

      url: `/getcity/treeview`,
    })
      .then((res) => {
        const treeFormatData = res.data.data.map((country) => {
          return {
            value: country.country_id,
            label: country.country_name,
            children: country.states.map((state) => {
              return {
                value: state.state_id,
                label: state.state_name,
                children: state.cities.map((city) => {
                  return {
                    value: city.city_id,
                    label: city.city_name,
                  };
                }),
              };
            }),
          };
        });

        setTreeData(treeFormatData);
        setValue(undefined);
      })
      .catch((err) => {
        console.log(err);
      });

    // get region data
    axios({
      method: "GET",
      url: `/treeview/newsite?orgid=${OrgSelection.current_org}`,
    })
      .then((res) => {
        const RegiontreeFormatData = res.data.data.map((region) => {
          return {
            value: region.regionid,
            label: region.name,
          };
        });
        setRegionTreedata(RegiontreeFormatData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [OrgSelection.current_org]);

  const onFinish = (values) => {
    axios({
      method: "PUT",
      data: {
        areaname: values.name,
        areacode: values.id,
      },

      url: `/modify/area?areaid=${a.id}`,
    })
      .then((res) => {
        message.success("Area updated successfully!");
        // history.push(`/location/${OrgSelection.current_org}`);
        setIsModalVisible(false);
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  const onFinishFailed = () => {
    message.warning("Please enter all details");
  };
  const { Option } = Select;

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
        <>
          <Form
            // {...formItemLayout}
            layout="vertical"
            initialValues={a}
            hideRequiredMark
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
            scrollToFirstError
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  initialValues={a.name}
                  name="name"
                  label="Area Name"
                  rules={[
                    { required: true, message: "Please enter Area Name" },
                  ]}
                >
                  <Input placeholder="Please enter Area Name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  initialValues={a.id}
                  name="id"
                  label="Area Code"
                  rules={[
                    { required: true, message: "Please enter Area Code" },
                  ]}
                >
                  <Input placeholder="Please enter Area Code" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
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
                  <Button type="danger" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Row>
          </Form>
        </>
      </Modal>
    </>
  );
};

export default AreaEdit;
