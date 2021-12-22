import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Popover, Descriptions, Empty } from "antd";


function getDisplay(hdata) {
  if (hdata[1] >= 4) {
    return "#7CB342";
  } else if (hdata[1] >= 1) {
    return "#FDD835";
  } 
  else {
    return "#EF5350";
  }
}

const HeartbeatRow2 = (panel_no) => {
  //API for fetching Hearbeat list of current panel no
  const date_ = moment(new Date()).format("YYYY-MM-DD");
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
    //API for fetching Hearbeat list of current panelid
    const date_ = moment(new Date()).format("YYYY-MM-DD");
    axios({
      method: "GET",
      params: {
        panel_no: `${panel_no.panel_no}`,
        start_time: `${date_}T00:00:00+05:30`,
        end_time: `${date_}T23:59:59+05:30`,
      },
      url: `/getheartbeat/panelno`,
    })
      .then((res) => {
        try {
          setHdata(getnewdata(res));
          // setIsLoading(false);
          console.log(res.data);
        } catch (err) {
          setNodata(true);
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
          {parseFloat(hdata[5]).toFixed(2)}
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
              <Popover content={content1} style = {{ height: "200px",  width: "200px"}}>
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
        {/* <th>Time</th> */}
        {data.map((hdata) => {  
          return (
            <Popover content={content(hdata)} style = {{ height: "50px",  width: "50px"}}>
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
export default HeartbeatRow2;