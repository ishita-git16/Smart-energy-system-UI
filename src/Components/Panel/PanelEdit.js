import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Cascader,
  message,
  Spin,
  Space,
  Descriptions,
} from "antd";
import axios from "axios";
import "antd/dist/antd.css";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tabs, Popconfirm } from "antd";
import DevicelList from "../Device/DeviceList";
import OutputList1 from "../Output/OutputList";
import ArrowLeftOutlined from "@ant-design/icons";
import InputList from "../Input/InputList";
import Heartbeat from "../Heartbeat/Heartbeat";

const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
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

function filter(inputValue, path) {
  return path.some(
    (option) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
}

const PanelEdit = () => {
  const [form] = Form.useForm();
  const [panelData, setPanelData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  const [currentTab, setCurrentTab] = useState("1");

  const onChangeHandler = (e) => {
    e.persist();
    setPanelData((prev) => ({
      ...prev,
      [e.target.value]: e.target.value,
    }));
  };

  const { panelid } = useParams();
  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  const callback = (key) => {
    console.log(key);
    setCurrentTab(key);
  };

  function cancel(e) {
    console.log(e);
    message.error("Click on No");
  }

  const confirm_delete = (a) => {
    axios({
      method: "POST",
      url: `/panel/deregister/panelid?panelid=${panelid}`,
    })
      .then((res) => {
        message.success("Panel deregistered successfully!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Oops! something went wrong");
      });
  };
  const onFinish = (values) => {
    const mydata = {
      panelname: values.panelname,
      // panelnumber: values.panelnumber,
      siteid: values.siteid[2],
      areaid: values.siteid[1],
      regionid: values.siteid[0],
    };

    axios({
      method: "PUT",

      data: mydata,
      url: `/panel/edit/panelid?panelid=${panelid}`,
    })
      .then((res) => {
        message.success("Data updated successfully!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Oops! something went wrong");
      });
  };

  useEffect(() => {
    // API for fetching panel list (all without filtering)
    axios({
      method: "GET",
      url: `/panel/panelid?panelid=${panelid}`,
    })
      .then((res) => {
        console.log(res.data);
        let api_data = res.data.data;
        api_data.siteid = [api_data.regionid, api_data.areaid, api_data.siteid];
        setPanelData(api_data);
        setIsLoading(false);
        localStorage.setItem("panelno", res.data.data.panelnumber);
      })
      .catch((err) => {
        console.log(err);
      });

    // API for fetching tree view data
    axios({
      method: "GET",

      url: `/getorg/treeview?org_id=${OrgSelection.current_org}`,
    })
      .then((res) => {
        const treeFormatData = res.data.data.map((region) => {
          return {
            value: region.regionid,
            label: region.name,
            children: region.areas.map((area) => {
              return {
                value: area.areaid,
                label: area.name,
                children: area.sites.map((site) => {
                  return {
                    value: site.siteid,
                    label: site.sitename,
                  };
                }),
              };
            }),
          };
        });

        setTreeData(treeFormatData);
        setIsLoading2(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [panelid, OrgSelection.current_org]);

  if (isLoading || isLoading2) {
    return (
      <div>
        <Space size="middle">
          <Spin
            size="large"
            style={{ marginLeft: "530px", marginTop: "230px" }}
          />
        </Space>
      </div>
    );
  }

  return (
    <>
      <Link to="/panel">
        <ArrowLeftOutlined />
        Back
      </Link>

      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Panel" key="1">
          <Form
            {...formItemLayout}
            form={form}
            scrollToFirstError
            initialValues={panelData}
            onChange={onChangeHandler}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Panel Name"
              name="panelname"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input />
            </Form.Item>
            {/* <Form.Item
                label="Panel Number"
                name="panelnumber"
                rules={[{ required: true, message: "Required!" }]}
              >
                <Input />
              </Form.Item> */}
            <Form.Item
              label="Select Site"
              name="siteid"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Cascader
                options={treeData}
                placeholder="Please select"
                showSearch={{ filter }}
              />
            </Form.Item>
            <Descriptions
              title="Other Details"
              bordered={true}
              size="small"
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 2 }}
            >
              <Form.Item
                label="Panel Number"
                name="panelnumber"
                rules={[{ required: true, message: "Required!" }]}
              >
                {panelData.panelnumber}
              </Form.Item>
              <Form.Item
                label="Ip Address"
                name="ipaddress"
                rules={[{ required: true, message: "Required!" }]}
              >
                {panelData.ipaddress}
              </Form.Item>
              <Form.Item
                label="Serial Number"
                name="serialnumber"
                rules={[{ required: true, message: "Required!" }]}
              >
                {panelData.serialnumber}
              </Form.Item>
              <Form.Item
                label="Mac Address"
                name="macaddress"
                rules={[{ required: true, message: "Required!" }]}
              >
                {panelData.macaddress}
              </Form.Item>
              <Form.Item
                label="Created Date"
                name="createddate"
                rules={[{ required: true, message: "Required!" }]}
              >
                {panelData.createddate}
              </Form.Item>
              <Form.Item
                label="Updated Date"
                name="updateddate"
                rules={[{ required: true, message: "Required!" }]}
              >
                {panelData.updateddate}
              </Form.Item>
            </Descriptions>
            <br></br>
            <Form.Item {...tailFormItemLayout}>
              <Space>
                <Button
                  htmlType="submit"
                  style={{
                    alignItems: "right",
                    background: "green",
                    color: "white",
                    paddingLeft: "15px",
                  }}
                >
                  Submit
                </Button>
                <Popconfirm
                  title="Are you sure to delete this Panel?"
                  onConfirm={confirm_delete}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="danger">Delete</Button>
                </Popconfirm>
              </Space>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Devices" key="2">
          <DevicelList />
        </TabPane>
        <TabPane tab="Outputs" key="3">
          <OutputList1 />
        </TabPane>
        <TabPane tab="Inputs" key="4">
          <InputList />
        </TabPane>
        <TabPane tab="Heartbeat" key="5">
          <Heartbeat heartbeat_data={panelData} />
        </TabPane>
      </Tabs>
    </>
  );
};
export default PanelEdit;
