import React, { useState, useEffect } from "react";
import { Table, Tag, Space } from "antd";
import moment from "moment";

const { Column, ColumnGroup } = Table;

const Faults = () => {
  const data = [
    {
      key: "1",
      Faultname: "Fire",
      FaultCode: "F1",
      FaultOccurredAt: moment(Date.now()).format(["YYYY-MM-DD"])
      //   moment(Date.now().format("dd/mm/yyyy")),
    },
    {
      key: "2",
      Faultname: "Short circuit",
      FaultCode: "F2",
      FaultOccurredAt: moment(Date.now()).format(["YYYY-MM-DD"])
    },
    {
      key: "3",
      Faultname: "Fire",
      FaultCode: "F3",
      FaultOccurredAt: moment(Date.now()).format(["YYYY-MM-DD"])
    },
  ];

  return (
    <>
      <Table dataSource={data} pagination={false} height={300}>
        <ColumnGroup title="Fault Data">
          <Column title="Fault Name" dataIndex="Faultname" key="Faultname" />
          <Column title="Fault Code" dataIndex="FaultCode" key="FaultCode" />
          <Column
            title="Occurred At"
            dataIndex="FaultOccurredAt"
            key="FaultOccurredAt"
          />
        </ColumnGroup>
      </Table>
    </>
  );
};
export default Faults;
