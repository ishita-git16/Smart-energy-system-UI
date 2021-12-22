import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const styles = {
    dial: {
        display: "inline-block",
        width: 200,
        height: `auto`,
        color: "#000",
        // border: "0.5px solid #fff",
        padding: "2px"
    },
    title: {
        fontSize: "1.2em",
        color: "#000"
    }
};

const Speedometer = ({id, value, measurement, forValue, title}) => {
    const  listValues = {
        "DGBattery": {
            "startColor": "green",
            "endColor": "red",
            "maxValue" : 30,
            "segment" : 6,
            "measurement" : "V"
        },
        "DGFuel": {
            "startColor": "red",
            "endColor": "green",
            "maxValue" : 100,
            "segment" : 10,
            "measurement" : "%"
        },
        "UPSBattery": {
            "startColor": "green",
            "endColor": "red",
            "maxValue" : 400,
            "segment" : 10,
            "measurement" : "V"
        },
        "UPSLoad": {
            "startColor": "green",
            "endColor": "red",
            "maxValue" : 100,
            "segment" : 10,
            "measurement" : "%"
        },
    };
    return (
        <div style={styles.dial}>
            <ReactSpeedometer
                maxValue={listValues[forValue]["maxValue"]}
                minValue={0}
                height={130}
                width={200}
                value={value > listValues[forValue]["maxValue"] ? 0 : value}
                needleTransition="easeQuadIn"
                needleTransitionDuration={1000}
                segments={listValues[forValue]["segment"]}
                needleColor="red"
                startColor={listValues[forValue]["startColor"]}
                endColor={listValues[forValue]["endColor"]}
            />
            <div
                style={styles.title}>{ title + " - " + value + listValues[forValue]["measurement"]}</div>
        </div>
    );
};

export default Speedometer;
