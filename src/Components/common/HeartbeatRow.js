import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { DatePicker, Empty } from "antd";
import Allheartbeats from "../Heartbeat/Allheartbeats";
import { Popover, Descriptions } from "antd";

function getDisplay(hdata) {
  if (hdata.hbcount >= 45) {
    return "#7CB342";
  } else if (hdata.hbcount) {
    return "#FDD835";
  } else {
    return "#EF5350";
  }
}

function keyToTime(key) {
  var time = moment(key).format(" h:mm a");
  var date = moment(key.substring(0, 10), ["YYYY-MM-DD"]).format("MM-DD-YYYY");
  return [date, time];
}
const HeartbeatRow = (props) => {
  //API for fetching Hearbeat list of current panel no

  // const date_ = moment(new Date()).format("YYYY-MM-DD");
  const [nodata, setNodata] = useState(false);
  const [data, setHdata] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  function getnewdata(res) {
    if (props.mdata.mdata.paneltypeid == 4) {
      // try {
      if (res.data.results[0].series[0].values != undefined) {
        setHdata(res.data.results[0].series[0].values);
        return res.data.results[0].series[0].values;
      }
      // }
      //  catch (err) {
      else {
        setNodata(true);
      }
    } else if (props.mdata.mdata.paneltypeid == 1) {
      // try {

      if (res.data != undefined) {
        setHdata(res.data);
        return res.data;
      }
      // } catch (err) {
      else {
        setNodata(true);
      }
    }
  }

  function selectivedata(props, hdata) {
    if (props.mdata.mdata.paneltypeid == 4) {
      return hdata[1];
    } else if (props.mdata.mdata.paneltypeid == 1) {
      return hdata.hbcount;
    }
  }
  // for(let i = 0; i < res.data.length ; i++){
  // for(let j = 0; j < res.data[0].length ; j++){
  // const arr = [];
  // if (res.data[i] != undefined) {
  // arr.push(res.data[i]);

  // }
  // }
  // return arr;
  // return arr;
  // }

  useEffect(() => {
    //API for fetching Heartbeat list of current panelid
    // const date_ = moment(new Date()).format("YYYY-MM-DD");
    // const date_ = mydata.dates;
    axios({
      method: "GET",
      params: {
        // panel_no: `${mydata.mydata}`,
        // start_time: `${date_}T00:00:00+05:30`,
        // end_time: `${date_}T23:59:59+05:30`,
        panel_no: "000002",
        // panel_no: `${props.mdata.panelnumber}`,
        start_time: `${props.dates.dates}T00:00:00+05:30`,
        end_time: `${props.dates.dates}T23:59:59+05:30`,
        paneltypeid: `${props.mdata.mdata.paneltypeid}`,
        // paneltypeid:`${props.pdata.pdata.paneltypeid}`
      },
      url: `/getheartbeat/panelno?panel_no=000002&start_time=${props.dates.dates}T00:00:00+05:30&end_time=${props.dates.dates}T23:59:59+05:30&paneltypeid=${props.mdata.mdata.paneltypeid}`,
      // url: `/getheartbeat/panelno`
    })
      .then((res) => {
        try {
          // setHdata(getnewdata(res));
          // if(props.mdata.mdata.paneltypeid == 4){
          setHdata(getnewdata(res));
          // }
          // else if(props.mdata.mdata.paneltypeid==1){
          // setHdata(getnewdata(res));
          // }
          // setHdata(res);
          //  setIsLoading(false);
          // console.log(res.data);
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
    return <Empty />;
  };
  //   <Descriptions
  //     size="small"
  //     bordered
  //     layout="horizontal"
  //     column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
  //   >
  //     <Descriptions.Item label="Mean CPU Percentage">
  //      NULL
  //     </Descriptions.Item>

  //     <Descriptions.Item label="Mean Disk Usage">
  //       NULL
  //     </Descriptions.Item>

  //     <Descriptions.Item label="Mean Memory">
  //      NULL
  //     </Descriptions.Item>

  //     <Descriptions.Item label="Mean Temperature">
  //      NULL
  //     </Descriptions.Item>
  //   </Descriptions>
  // );
  // };

  const content2 = (hdata) => {
    return (
      <Descriptions
        size="small"
        bordered
        layout="horizontal"
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Date-Time">
          {keyToTime(hdata.date_time)}
        </Descriptions.Item>
      </Descriptions>
    );
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
                  {/* {selectivedata(hdata)} */}
                  {hdata.hbcount}
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
            <Popover content={content2(hdata)}>
              <td
                style={{
                  backgroundColor: getDisplay(hdata),
                  textAlign: "center",
                }}
              >
                {/* {hdata[1]} */}
                {selectivedata(props, hdata)}
                {/* {hdata.hbcount} */}
              </td>
            </Popover>
          );
        })}
      </tr>
    </>
  );
};
export default HeartbeatRow;
