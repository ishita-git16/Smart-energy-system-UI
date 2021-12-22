import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { DatePicker, Empty } from 'antd';
import Allheartbeats from "../Heartbeat/Allheartbeats"
import { Popover, Descriptions } from "antd";

function getDisplay(hdata) {
  if (hdata[1] >= 4) {
    return "#7CB342";
  } else if (hdata[1] >= 1) {
    return "#FDD835";
  } else {
    return "#EF5350";
  }
}

const Hbrow4 = (props) => {
  //API for fetching Hearbeat list of current panel no
  
  // const date_ = moment(new Date()).format("YYYY-MM-DD");
  const [nodata, setNodata] = useState(false);
  const [data, setHdata] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  function getnewdata(res) {
    try {
      if (res.data.results[0].series[0].values != undefined) {
        return res.data.results[0].series[0].values;
      }
    } catch (err) {
      setNodata(true);
    }
  }
  
  useEffect(() => {
    //API for fetching Heartbeat list of current panelid
    // const date_ = moment(new Date()).format("YYYY-MM-DD");
    // const date_ = mydata.dates;
    axios({
      method: "GET",
      params: {
      
        panel_no: `${props.mdata.mdata.panelnumber}`,
        start_time: `${props.dates.dates}T00:00:00+05:30`,
        end_time: `${props.dates.dates}T23:59:59+05:30`,
        paneltypeid: `${props.mdata.mdata.paneltypeid}`
        
      },
      url: `/getheartbeat/panelno?panel_no=${props.mdata.mdata.panelnumber}&start_time=${props.dates.dates}T00:00:00+05:30&end_time=${props.dates.dates}T23:59:59+05:30&paneltypeid=${props.mdata.mdata.paneltypeid}`,
      // url: `/getheartbeat/panelno`
    })
      .then((res) => {
        try {
         
          setHdata(getnewdata(res));
        } catch (err) {
          setNodata(true);
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props]);
  const emptyRowData = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  

  const content1 = () => {
    return (
      <Empty/>
    )
  };

  const content = (hdata) => {
    return (
      <Descriptions
        size="small"
        bordered
        layout="horizontal"
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Mean CPU Percentage">
          {hdata[2]}
        </Descriptions.Item>
        
        <Descriptions.Item label="Mean Disk Usage">
          {hdata[3]}
        </Descriptions.Item>
        
        <Descriptions.Item label="Mean Memory">
          {parseFloat(hdata[5]).toFixed(2)}
        </Descriptions.Item>
        
        <Descriptions.Item label="Mean Temperature">
          {parseFloat(hdata[6]).toFixed(2)}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  if (nodata) {
    return (
      <>
        <tr>
          {emptyRowData.map((hdata) => {
            return (
              <Popover content={content1}>
              <td
                style={{
                  backgroundColor: getDisplay(hdata),
                  textAlign: "center",
                }}
              >
                {hdata[1]}
              </td>
               </Popover>
            );
          })}
        </tr>
      </>
    );
  }
  return (
    <>
      <tr>
        {data.map((hdata) => {
          return (
            <Popover content={content(hdata)}>
              <td
                style={{
                  backgroundColor: getDisplay(hdata),
                  textAlign: "center",
                }}
              >
                {hdata[1]}
              </td>
            </Popover>
          );
        })}
      </tr>
    </>
  );
};
export default Hbrow4;
