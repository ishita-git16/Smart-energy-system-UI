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
} from "antd";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from "axios";
// const formItemLayout = {
//   labelCol: {
//     xs: {
//       span: 24,
//     },
//     sm: {
//       span: 8,
//     },
//   },
//   wrapperCol: {
//     xs: {
//       span: 24,
//     },
//     sm: {
//       span: 16,
//     },
//   },
// };
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
const AddSite = () => {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);
  const [regiontreedata, setRegionTreedata] = useState([]);
  const [value, setValue] = useState(undefined);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);

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
    // const mydata = {
    //   site_name: values.site_name,
    //   description: values.description,
    //   city_id: values.city_id[2],
    //   state_id: values.city_id[1],
    //   country_id: values.city_id[0],
    //   organisationid: `${OrgSelection.current_org}`,
    //   addressline1: values.addressline1,
    //   addressline2: values.addressline2,
    //   sitecode: values.sitecode,
    //   //   longitude: value.longitude,
    //   //   latitude: value.latitude,
    // };
    console.log("mydata:");

    axios({
      method: "POST",

      data: {
        site_name: values.site_name,
        description: values.description,
        cityid: values.city_id[2],
        stateid: values.city_id[1],
        countryid: values.city_id[0],
        organisationid: `${OrgSelection.current_org}`,
        addressline1: values.addressline1,
        addressline2: values.addressline2,
        sitecode: values.sitecode,
        regionid: values.siteid[0],
        areaid: values.siteid[1],

        // longitude: value.longitude,
        // latitude: value.latitude,
      },
      //   JSON.stringify(mydata),
      url: `/add/site`,
    })
      .then((res) => {
        message.success("Site added successfully!");
        // history.push(`/paneledit/${res.data.panel_id}`);
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
              name="site_name"
              label="Site Name"
              rules={[{ required: true, message: "Please enter Site Name" }]}
            >
              <Input placeholder="Please enter site name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="addressline1"
              label="Address 1"
              rules={[{ required: true, message: "Please enter user name" }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="addressline2"
              label="Address 2"
              rules={[{ required: true, message: "Please enter user name" }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sitecode"
              label="Site Code"
              rules={[{ required: true, message: "Please enter user name" }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="longitude"
              label="Longitude"
              rules={[{ required: true, message: "Please enter user name" }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[{ required: true, message: "Please enter user name" }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "please enter  description",
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="please enter description" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Select City"
              name="city_id"
              rules={[{ required: true, message: "Please select City!" }]}
            >
              <Cascader
                options={treeData}
                placeholder="Please select"
                // showSearch={{ filter }}
              />
            </Form.Item>

            <Form.Item
              label="Select Region/Area"
              name="siteid"
              rules={[{ required: true, message: "Please select site!" }]}
            >
              <Cascader
                options={regiontreedata}
                placeholder="Please select"
                // showSearch={{ filter }}
              />
            </Form.Item>
          </Col>
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
                Add Site
              </Button>
              <Link to="/location">
              <Button type="danger" >
                Cancel
              </Button>
              </Link>
            </Space>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};
export default AddSite;
