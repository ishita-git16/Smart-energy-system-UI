import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  message,
  Select,
  Drawer,
  Divider,
  TreeSelect,
} from "antd";
import axios from "axios";
import "antd/dist/antd.css";
import { useParams } from "react-router-dom";
const { Option } = Select;

const AddInputToChildSubsite = (mydata) => {
  const [visible, setVisible] = useState(false);
  const [tagData, setTagData] = useState(undefined);
  const [currentSelectedTag, setCurrentSelectedTag] = useState(undefined);
  const [initialSelectedInputs, setinitialSelectedInputs] = useState([]);
  const [currentSelectedDevice, setCurrentSelectedDevice] = useState(undefined);
  const { id } = useParams();
  const [DeviceInputTree, setDeviceInputTree] = useState([]);

  const onDeviceInputTreeChange = (e) => {
    setinitialSelectedInputs(e);
    console.log(e);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onTagChange = (values) => {
    console.log(values);
    setCurrentSelectedTag(values);
  };

  const onDeviceChange = (values) => {
    setCurrentSelectedDevice(values);
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: `/input_tags`,
    })
      .then((res) => {
        setTagData(res.data);
        setCurrentSelectedTag(res.data[0].tag_id);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `/treeview/devices/inputs?siteid=${id}`,
    })
      .then((res) => {
        const tree_data = res.data.data.map((dev) => {
          return {
            disableCheckbox: true,
            selectable: false,
            title: `${dev.name}`,
            value: `${dev.name}`,
            key: `dev_${dev.device_id}`,
            children: dev.inputs.map((input) => {
              return {
                title: `${input.name} / ${input.zone}`,
                value: `${input.gen_input_id}`,
                key: `inp_${input.gen_input_id}`,
              };
            }),
          };
        });

        setDeviceInputTree(tree_data);

        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios({
      method: "GET",
      // url: `/getmappedinputs/deviceid_tagid?tagid=1&subsiteid=37`,
      url: `/getmappedinputs/deviceid_tagid?tagid=${currentSelectedTag}&subsiteid=${mydata.mydata.value}`,
    })
      .then((res) => {
        const tree_data = res.data.map((input) => {
          return input.gen_input_id.toString();
        });

        setinitialSelectedInputs(tree_data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentSelectedTag]);

  const onSubmit = () => {
    axios({
      method: "POST",
      data: initialSelectedInputs.map((id) => {
        return {
          subsite_id: mydata.mydata.value,
          input_id: id,
          tag_id: currentSelectedTag,
        };
      }),
      url: `/mapping/subsite_with_input`,
    })
      .then((res) => {
        message.success("Inputs added successfully!");
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Add Inputs
      </Button>
      <Drawer
        title="Add Inputs"
        placement="right"
        onClose={onClose}
        width={600}
        visible={visible}
      >
        <Space>
          Select Tag:
          <Select
            style={{ width: "200px", height: "32px", textcolor: "black" }}
            onChange={onTagChange}
            defaultValue={currentSelectedTag}
          >
            {tagData?.map((mdata) => {
              return (
                <Option key={mdata.tag_id} value={mdata.tag_id}>
                  {mdata.tag_name}
                </Option>
              );
            })}
          </Select>
        </Space>
        <Divider />
        <Space>
          <div>
            Select Inputs:
            <TreeSelect
              style={{ width: "300px", height: "32px", textcolor: "black" }}
              treeData={DeviceInputTree}
              treeCheckable
              value={initialSelectedInputs}
              onChange={onDeviceInputTreeChange}
            />
            <Divider />
            <Button
              htmlType="submit"
              onClick={onSubmit}
              type="primary"
              style={{ position: "fixed", bottom: 280, marginLeft: "250px" }}
            >
              Add
            </Button>
          </div>
        </Space>
      </Drawer>
    </>
  );
};
export default AddInputToChildSubsite;
