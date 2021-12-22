import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
//Data for getting power consumption
const Chart = () => {
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
      data: {
        panel_no: "000002",
        device_code: "MOD01",
        measurement: "energy",
        zone: "KVAH",
        start_time: `${dates}T00:00:00+05:30`,
        end_time: `${dates}T23:59:59+05:30`,
        aggregate: "difference",
        group_by: "15m",
      },
      url: `/getdevicedata/zone`,
    })
      .then((res) => {
        try {
          function generateData(gdata) {
            var data1 = [];
            for (var i = 0; i < gdata.values.length; i++) {
              var temp = {
                name: keyToTime(gdata.values[i][0]),
                kw: gdata.values[i][1],
              };
              data1.push(temp);
            }

            return data1;
          }
          var newdata = res.data.results.map((mdata) => {
            return {
              children: mdata.series.map((gdata) => {
                var data = generateData(gdata);
                return {
                  data,
                };
              }),
            };
          });
          setData(newdata[0].children[0].data);
        } catch (err) {
          console.log(err);
        }
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
      kw: data[1],
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
        todayButton={"Today"}
      /> */}

      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="kw"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        {/* <Line type="monotone" dataKey="kwh" stroke="#82ca9d" /> */}
      </LineChart>
    </>
  );
};

export default Chart;
