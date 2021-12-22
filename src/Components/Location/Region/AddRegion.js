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
import { useHistory } from "react-router";
import axios from "axios";

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

const AddRegion = () => {
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

  const Region = () => {
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
        url: `/getorg/treeview?org_id=${OrgSelection.current_org}`,
      })
        .then((res) => {
          const RegiontreeFormatData = res.data.data.map((region) => {
            return {
              value: region.regionid,
              label: region.name,
              children: region.areas.map((area) => {
                return {
                  value: area.areaid,
                  label: area.name,
                  // children: area.sites.map((site) => {
                  //   return {
                  //     value: site.siteid,
                  //     label: site.sitename,
                  //   };
                  // }),
                };
              }),
            };
          });

          setRegionTreedata(RegiontreeFormatData);
          // console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [OrgSelection.current_org]);

    const onFinish = (values, key) => {
      axios({
        method: "POST",
        data: {
          region_name: values.region_name,
          org_id: `${OrgSelection.current_org}`,
          region_code: values.region_code,
        },
        url: `/add/region?org_id=${OrgSelection.current_org}`,
      })
        .then((res) => {
          message.success("Region added successfully!");
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
                name="region_name"
                label="Region Name"
                rules={[
                  { required: true, message: "Please enter Region Name" },
                ]}
              >
                <Input placeholder="Please enter site name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="region_code"
                label="Region Code"
                rules={[
                  { required: true, message: "Please enter Region Code" },
                ]}
              >
                <Input placeholder="Please enter Region Code" />
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
                  Add Region
                </Button>

                <Button type="danger" onClick={handleCancel}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </>
    );
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Region
      </Button>
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Region />
      </Modal>
    </>
  );
};

export default AddRegion;
