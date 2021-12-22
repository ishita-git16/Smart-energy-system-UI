// import "./styles.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "react-datepicker/dist/react-datepicker.css";

const Bar1 = () => {
  // var min1 = Infinity ;
  // var max1 = 0;
  const date_ = moment(new Date()).format("YYYY-MM-DD");
  const dates = convert(date_);
  const [data, setData] = useState([]);
  const [newdata, setNewdata] = useState([]);
  // const [rangeStart, setRangeStart] = React.useState(new Date)
  // const defaultEndDate = new Date()
  // defaultEndDate.setDate(defaultEndDate.getDate() + 7)
  // const [rangeEnd, setRangeEnd] = React.useState(defaultEndDate)
  // const today = new Date()

  useEffect(() => {
    axios({
      method: "POST",
      url: `/getdevicedata/zone`,
      data: {
        panel_no: "000002",
        device_code: "MOD02",
        measurement: "energy",
        zone: "KWH",
        start_time: `${dates}T00:00:00+05:30`,
        end_time: `${dates}T23:59:59+05:30`,
      },
    })
      .then((res) => {
        console.log("Hello");
        console.log(res);
        const a = [];
        console.log(res.data.results[0].series[0].values);
        res.data.results[0].series[0].values.map((kdata) => {
          a.push(kdata);
        });
        setNewdata(a);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const selectDateHandler = (d) => {
  //   setDate(d)
  // }

  const keyToTime = (key) => {
    var time1 = moment(key).format(" h:mm");
    var date = moment(key.substring(0, 10), ["YYYY-MM-DD"]).format("DD MMM");
    return [time1, date];
  };

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const keyValueData = newdata.map((data) => {
    return {
      time: `${keyToTime(data[0])}`,
      kwh: data[1],
    };
  });
  // console.log(keyValueData)

  return (
    <>
      {/* <DatePicker
    dateFormat="yyyy/MM/dd"
    selected={startDate}
    onChange={selectDateHandler} 
    minDate={today}
    todayButton={"Today"}/>
     */}
      <BarChart
        width={1000}
        height={300}
        data={keyValueData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[10000, 10400]} />
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
        <ReferenceLine y={0} stroke="#000" />
        <Brush dataKey="time" height={30} stroke="#8884d8" />
        {/* <Bar dataKey="pv" fill="#8884d8" /> */}
        <Bar dataKey="kwh" fill="#82ca9d" />
      </BarChart>
    </>
  );
};

export default Bar1;
