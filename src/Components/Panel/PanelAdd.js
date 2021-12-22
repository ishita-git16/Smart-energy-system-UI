import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import {
  Form,
  Input,
  Cascader,
  message,
  Select,
  Collapse,
  Tooltip,
} from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { ReloadOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

function filter(inputValue, path) {
  return path.some(
    (option) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
}
const { Option } = Select;
const { Panel } = Collapse;
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
const PanelAdd = () => {
  const [form] = Form.useForm();
  const [current_selected_tempid, Setcurrent_selected_tempid] = useState();
  const [tdata, SetTdata] = useState({});
  const [serialnodata, SetSerialnodata] = useState([]);
  const [templatename, SetTemplatename] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const OrgSelection = useSelector((state) => state.OrgSelectorReducer);
  let history = useHistory();
  // Call when refetch serial no
  const refreshSerialnoData = () => {
    return axios({
      method: "GET",

      url: `/getall_unassigned_serial`,
    })
      .then((res) => {
        SetSerialnodata(res.data);
      })
      .catch((err) => {
        console.log(err);
        message.error("error");
      });
  };

  function onChange(value) {
    console.log(`selected ${value}`);
  }
  function onTemplateChange(value, key) {
    Setcurrent_selected_tempid(key.key);
  }

  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }

  function onSearch(val) {
    console.log("search:", val);
  }
  useEffect(() => {
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
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    //Api for fetching serial number
    axios({
      method: "GET",

      url: `/getall_unassigned_serial`,
    })
      .then((res) => {
        SetSerialnodata(res.data);
      })
      .catch((err) => {
        console.log(err);
        message.error("error");
      });
    //Api for fetching template name for select dropdown
    axios({
      method: "GET",

      url: `/getall_http_templates`,
    })
      .then((res) => {
        SetTemplatename(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    //Api for fetching single template id data
    axios({
      method: "GET",
      url: `/http_templates/template_id?template_id=${current_selected_tempid}`,
    })
      .then((res) => {
        // SetTdata(res.data);
        form.setFieldsValue({
          ip: res.data.ip,
          port: res.data.port,
          template_name: res.data.template_name,
          proto: res.data.proto,
          base_path: res.data.base_path,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [current_selected_tempid, OrgSelection.current_org]);

  const onFinish = (values, key) => {
    const mydata = {
      new_org_panel: {
        panelname: values.panelname,
        panelnumber: values.panelnumber,
        siteid: values.siteid[2],
        areaid: values.siteid[1],
        regionid: values.siteid[0],
        organisationid: `${OrgSelection.current_org}`,
        panelcode: values.panelcode,
        serialnumber: values.serialnumber,
        serial_id: values.serial_id,
      },
      http_details: {
        org_id: `${OrgSelection.current_org}`,
        port: values.port,
        proto: values.proto,
        ip: values.ip,
        base_path: values.base_path,
        template_name: values.template_name,
      },
    };

    axios({
      method: "POST",

      data: mydata,
      url: `/panel/add`,
    })
      .then((res) => {
        message.success("Panel added successfully!");
        history.push(`/paneledit/${res.data.panel_id}`);
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
    <div style = {{overflow: "scroll", height: "450px" }} >     
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={tdata}
        form={form}
        scrollToFirstError
      >
        <h1>Panel Details</h1>
        <Form.Item
          label="Panel Name"
          name="panelname"
          rules={[{ required: true, message: "Please enter panel name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Panel Number"
          name="panelnumber"
          rules={[{ required: true, message: "Please enter panel number!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Panel Code"
          name="panelcode"
          rules={[{ required: true, message: "Please enter panel code!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Select Site"
          name="siteid"
          rules={[{ required: true, message: "Please select site!" }]}
        >
          <Cascader
            options={treeData}
            placeholder="Please select"
            showSearch={{ filter }}
          />
        </Form.Item>

        <Form.Item label="Serial Number">
          <Space>
            <Form.Item
              name="serial_id"
              noStyle
              rules={[
                { required: true, message: "Please select Serial number!" },
              ]}
            >
              <Select
                showSearch
                style={{ width: 200 }}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {serialnodata.map((serialno) => (
                  <Option
                    value={serialno.serial_id}
                    key={`${serialno.serial_id}`}
                  >
                    {serialno.serial_no}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Tooltip title="Fetch Serial no">
              <ReloadOutlined
                onClick={refreshSerialnoData}
                style={{ color: "black", size: "100px" }}
                theme="outlined"
              />
            </Tooltip>
          </Space>
        </Form.Item>

        {/* <Form.Item label="ip_address" name="ip_address">
          <Input />
        </Form.Item> */}
        <Collapse accordion ghost>
          <Panel header= "Http Details" key="1" >
            
            <Form.Item
              label="Template Name"
              name="template_name"
              rules={[
                { required: true, message: "Please select template name!" },
              ]}
            >
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select Template Name"
                optionFilterProp="children"
                onChange={onTemplateChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {templatename.map((templatedata) => (
                  <Option
                    value={templatedata.template_name}
                    key={`${templatedata.cloud_template_id}`}
                  >
                    {templatedata.template_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Protocol"
              name="proto"
              rules={[{ required: true, message: "Required Protocol!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Base Path"
              name="base_path"
              rules={[{ required: true, message: "Required Basepath!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ip Address"
              name="ip"
              rules={[{ required: true, message: "Required Ipaddress!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Port"
              name="port"
              rules={[{ required: true, message: "Required Port" }]}
            >
              <Input size="small" />
            </Form.Item>
            {/* <Form.Item
              label="Template Name"
              name="template_name"
              rules={[{ required: true, message: "Required Templatename!" }]}
            >
              <Input />
            </Form.Item> */}
          </Panel>
          {/* <Panel header="Http Details" key="2">
          </Panel> */}
        </Collapse>
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
              Add Panel
            </Button>
            <Link to="/panel">
              <Button type="danger" htmlType="submit">
                Cancel
              </Button>
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </div>
    </>
  );
};
export default PanelAdd;
