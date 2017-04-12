"use strict";

var urlRecent = "https://fcctop100.herokuapp.com/api/fccusers/top/recent";
var urlAllTime = "https://fcctop100.herokuapp.com/api/fccusers/top/alltime";
var linkStyle = { textDecoration: 'none' };

var Row = React.createClass({
  displayName: "Row",

  render: function render() {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        this.props.number
      ),
      React.createElement(
        "td",
        null,
        React.createElement("img", { src: this.props.camper.img, alt: "Profile image" }),
        React.createElement(
          "a",
          { href: "https://www.freecodecamp.com/" + this.props.camper.username, target: "_blank", style: linkStyle },
          React.createElement(
            "i",
            null,
            this.props.camper.username
          )
        )
      ),
      React.createElement(
        "td",
        null,
        this.props.camper.recent
      ),
      React.createElement(
        "td",
        null,
        this.props.camper.alltime
      )
    );
  }
});

var Table = React.createClass({
  displayName: "Table",

  sortRecent: function sortRecent() {
    this.props.url = urlRecent;
    this.loadCampers();
  },
  sortAll: function sortAll() {
    this.props.url = urlAllTime;
    this.loadCampers();
  },
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  loadCampers: function loadCampers() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function componentDidMount() {
    this.loadCampers();
  },
  render: function render() {
    var rows = [];
    var number = 0;
    this.state.data.forEach(function (camper) {
      number++;
      rows.push(React.createElement(Row, { number: number, camper: camper }));
    });
    return React.createElement(
      "div",
      { className: "table-wrapper" },
      React.createElement(
        "h3",
        null,
        "Free Code Camp Leaderboard"
      ),
      React.createElement(
        "table",
        null,
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              null,
              "#"
            ),
            React.createElement(
              "th",
              null,
              "Username"
            ),
            React.createElement(
              "th",
              null,
              "Points in 30 Days",
              React.createElement("div", { onClick: this.sortRecent, className: "down-arrow", title: "Sort by" })
            ),
            React.createElement(
              "th",
              null,
              "All Time Points",
              React.createElement("div", { onClick: this.sortAll, className: "down-arrow", title: "Sort by" })
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          rows
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(Table, { url: urlAllTime }), document.getElementById('container'));