// jshint newcap:false, camelcase:false
"use strict";

var React = require("react");
var el = React.createElement;
var formatHours = require("../lib/time-utils").formatHours;
var formatMinutes = require("../lib/time-utils").formatMinutes;
var getAmPm = require("../lib/time-utils").getAmPm;
var colors = require("./colors");
var getFirstStop = require("./schedule-util").getFirstStop;
var getLastStop = require("./schedule-util").getLastStop;

function renderTrainName(props) {
  var firstTripStop = getFirstStop(props.scheduledTrip);
  var headsign = firstTripStop.stop.platform_code;
  var trainNumber = props.scheduledTrip.trip.trip_short_name;
  return el("span", {
    style: props.style,
    children: [
      headsign,
      el("span", {
        style: {
          "margin-left": "0.25em",
        },
        children: trainNumber,
      }),
    ],
  });
}

function renderBoardTrainType(props) {
  var trainType = props.scheduledTrip.route.route_long_name;
  return el("span", {
    style: props.styles,
    children: trainType,
  });
}

function getTrainTypeBackgroundColor(type) {
  if (type === "Limited") {
    return colors.limited;
  }
  else if (type === "Bullet") {
    return colors.bullet;
  }
  else {
    return colors.local;
  }
}

function getTrainTypeColor(type) {
  if (type === "Limited") {
    return "#111";
  }
  else if (type === "Bullet") {
    return "#f5f5f5";
  }
  else {
    return "#111";
  }
}

function renderBoardTime(props) {
  var date = props.date;
  return el("time", {
    style: props.style,
    dateTime: date.toISOString(),
    children: [
      renderBoardHours(date.getHours()),
      ":",
      formatMinutes(date.getMinutes()),
      el("span", {
        className: "dim",
        style: {
          "margin-left": ".4em",
          "font-size": "65%",
          "text-transform": "uppercase",
        },
        children: getAmPm(date),
      }),
    ],
  });
}

function renderBoardHours(hours) {
  hours = formatHours(hours);
  if (hours.length < 2) {
    return el("span", {
      dangerouslySetInnerHTML: {
        __html: "0" + hours,
      },
    });
  }
  else {
    return hours;
  }
}


function renderBoardDuration(props) {
  var d = new Date(props.duration);
  return el("time", {
    className: props.className,
    style: props.style,
    children: [
      d.getUTCHours(),
      ":",
      formatMinutes(d.getUTCMinutes()),
    ],
  });
}

var ScheduledTripHeader = React.createClass({
  displayName: "ScheduledTripHeader",

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var firstStop = getFirstStop(scheduledTrip);
    var lastStop = getLastStop(scheduledTrip);
    return el("header", {
      style: this.props.style,
      children: [
        ScheduledTripTimes({
          scheduledTrip: this.props.scheduledTrip,
        }),
        el("div", {
          className: [
            "board-font",
          ].join(" "),
          style: {
            "display": "table",
            "width": "100%",
          },
          children: [
            ScheduledTripTrainInfo({
              style: {
                "display": "table-cell",
              },
              scheduledTrip: this.props.scheduledTrip,
            }),
            el("div", {
              style: {
                "display": "table-cell",
                "text-align": "right",
              },
              children: [
                el("span", {
                  className: "dim",
                  children: "Duration:",
                }),
                " ",
                renderBoardDuration({
                  duration: lastStop.date - firstStop.date
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
});

var ScheduledTripTimes = React.createClass({
  displayName: "ScheduledTripTimes",

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var firstStop = getFirstStop(scheduledTrip);
    var lastStop = getLastStop(scheduledTrip);
    return el("div", {
      className: [
        "board-font",
        "board-size",
      ].join(" "),
      style: {
        display: "table",
        "width": "100%",
      },
      children: [
        renderBoardTime({
          style: {
            display: "table-cell",
            "width": "50%",
          },
          date: firstStop.date,
        }),
        el("span", {
          style: {
            "margin": "0 0.5em",
            "text-align": "center",
            display: "table-cell",
          },
          children: "–",
        }),
        renderBoardTime({
          style: {
            display: "table-cell",
            "text-align": "right",
            "width": "50%",
          },
          date: lastStop.date,
        }),
      ],
    });
  },
});

var ScheduledTripTrainInfo = React.createClass({
  displayName: "ScheduledTripTrainInfo",

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var trainType = this.props.scheduledTrip.route.route_long_name;
    return el("div", {
      style: {
        "background-color": getTrainTypeBackgroundColor(trainType),
        "color": getTrainTypeColor(trainType),
        "padding": "0.25em .35em",
        "display": "inline-block",
      },
      children: [
        renderTrainName({
          scheduledTrip: scheduledTrip,
        }),
        " ",
        renderBoardTrainType({
          scheduledTrip: scheduledTrip,
        }),
      ]
    });
  },
});

// ## Exports
//

module.exports = ScheduledTripHeader;