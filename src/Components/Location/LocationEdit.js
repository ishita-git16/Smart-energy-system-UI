import React from "react";
import { Tabs } from "antd";
import SubsitesList from "../Location/SubSites/SubsitesList";
import SiteEdit from "../Location/Site/SiteEdit";
const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

const LocationEdit = () => {
  return (
    <>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Site" key="1">
          <SiteEdit />
        </TabPane>
        <TabPane tab="Subsites" key="2">
          <SubsitesList />
        </TabPane>
        {/* <TabPane tab="Site" key="3">
          <SiteList />
        </TabPane> */}
      </Tabs>
    </>
  );
};
export default LocationEdit;
