import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import HeartbeatRow2 from "../Heartbeat/HeartbeatRow2";
import { Space, Empty, Statistic, Card, Typography } from "antd";

const HeartbeatHeaders = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const Heartbeat = ({ heartbeat_data }) => {
  const [nodata, setNodata] = useState(false);
  // function getnewdata(res) {
  //   try {
  //     if (res.data.results[0].series[0].values != undefined) {
  //       return res.data.results[0].series[0].values;
  //     }
  //   } catch (err) {
  //     setNodata(true);
  //   }
  // }
  console.log(heartbeat_data);
  const { panelid } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [deviceuptimedata, setDeviceuptimedata] = useState([]);
  console.log(heartbeat_data);
  const keyToTime = (key) => {
    var time = moment(key.substring(11, 13), ["HH"]).format("HH");
    return time;
  };
  const [data, setData] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `/getlastheartbeat/panelno?panel_no=${heartbeat_data.panelnumber}`,
    })
      .then((res) => {
        try {
          setDeviceuptimedata(res.data.results[0].series[0].values[0]);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (nodata) {
    return <Empty />;
  }

  return (
    <>
      <Card>
        <Space>
          <Statistic
            title={<b style={{ color: "black" }}>Device Time</b>}
            value={deviceuptimedata[1] / 3600}
            precision={2}
            valueStyle={{ color: "#3f8600" }}
            suffix="hour"
          />
          <Statistic
            title={<b style={{ color: "black" }}>Device Uptime</b>}
            value={deviceuptimedata[0]}
            precision={2}
            valueStyle={{ color: "#3f8600" }}
          />
        </Space>
        <br />
        <Typography.Title level={4} style={{ marginLeft: "400px" }}>
          Heartbeat Count Hourly
        </Typography.Title>
        <table border="1px" width="100%">
          <tr>
            {HeartbeatHeaders.map((hdata) => {
              return <th>{hdata}</th>;
            })}
          </tr>
          <HeartbeatRow2 panel_no={heartbeat_data.panelnumber} />
        </table>
      </Card>
    </>
  );
};
export default Heartbeat;
