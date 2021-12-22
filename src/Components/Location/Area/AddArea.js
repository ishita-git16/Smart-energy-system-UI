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
  Cascader,
  Modal,
} from "antd";

import { useSelector } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router";

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

const AddArea = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const Area = () => {
    const [form] = Form.useForm();
    const [treeData, setTreeData] = useState([]);
    const [regiontreedata, setRegionTreedata] = useState([]);
    const [value, setValue] = useState(undefined);
    const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
    let history = useHistory();
    //   const onFilterSearch = (e) => {
    //     console.log(e);
    //   };

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

    const onFinish = (values, key) => {
      axios({
        method: "POST",
        data: {
          org_id: `${OrgSelection.current_org}`,
          region_id: values.siteid[0],
          area_code: values.area_code,
          area_name: values.area_name,
        },
        url: `/add/area?org_id=${OrgSelection.current_org}`,
      })
        .then((res) => {
          message.success("Area added successfully!");
          history.push(`/location/${OrgSelection.current_org}`);
          setIsModalVisible(false);
        })
        .catch(
          (err) => {
            console.log(err);
            message.error(err.message);
          },
          [OrgSelection.current_org]
        );
    };

    const onFinishFailed = () => {
      message.warning("Please enter all details");
    };
    const { Option } = Select;

    return (
      <>
        <Form
          // {...formItemLayout}
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
                label="Select Region"
                name="siteid"
                // value="regionid"
                rules={[{ required: true, message: "Please select Region!" }]}
              >
                <Cascader
                  options={regiontreedata}
                  placeholder="Please select"
                  // showSearch={{ filter }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="area_code"
                label="Area Code"
                rules={[{ required: true, message: "Please enter Area Code" }]}
              >
                <Input placeholder="Please enter Area Code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="area_name"
                label="Area Name"
                rules={[{ required: true, message: "Please enter Area Name" }]}
              >
                <Input placeholder="Please enter Area Name" />
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
                  Add Area
                </Button>
                {/* <Link to="/panel"> */}
                <Button type="danger" onClick={handleCancel}>
                  Cancel
                </Button>
                {/* </Link> */}
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </>
    );
  };

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

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Area
      </Button>
      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Area />
      </Modal>
    </>
  );
};

export default AddArea;
