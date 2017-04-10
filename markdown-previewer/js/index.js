"use strict";

var text = "Heading \n ======= \n\n Sub-heading \n ----------- \n\n ### Another deeper heading \n\n Paragraphs are separated by a blank line. \n\n Leave 2 spaces at the end of a line to do a line break  \n\n Text attributes *italic*, **bold**, `monospace`, ~~strikethrough~~ . \n\n Shopping list: \n\n * apples \n * oranges \n * pears \n\nNumbered list: \n 1. apples \n 2. oranges \n 3. pears \n\nThe rain---not the reign---in Spain. \n\n *[Herman Fassett](https://freecodecamp.com/hermanfassett)*";

var Left = React.createClass({
  displayName: "Left",

  render: function render() {
    return React.createElement(
      "div",
      { className: "col-sm-6" },
      React.createElement(Label1, null),
      React.createElement(TextArea, { text: text })
    );
  }
});

var Label1 = React.createClass({
  displayName: "Label1",

  render: function render() {
    return React.createElement(
      "label",
      { htmlFor: "input" },
      "Type GitHub-flavored markdown below:"
    );
  }
});

var TextArea = React.createClass({
  displayName: "TextArea",

  render: function render() {
    return React.createElement(
      "textarea",
      { id: "input", className: "form-control", rows: "20" },
      this.props.text
    );
  }
});

var Right = React.createClass({
  displayName: "Right",

  render: function render() {
    return React.createElement(
      "div",
      { className: "col-sm-6" },
      React.createElement(Label2, null),
      React.createElement(Panel, null)
    );
  }
});

var Label2 = React.createClass({
  displayName: "Label2",

  render: function render() {
    return React.createElement(
      "label",
      { htmlFor: "output" },
      "HTML output:"
    );
  }
});

var Panel = React.createClass({
  displayName: "Panel",

  render: function render() {
    return React.createElement(
      "div",
      { className: "panel panel-default" },
      React.createElement("div", { id: "output", className: "panel-body output" })
    );
  }
});

ReactDOM.render(React.createElement(
  "div",
  null,
  React.createElement(Left, null),
  React.createElement(Right, null)
), document.getElementById('row'));

$(document).ready(function () {
  $("#output").html(marked(text));
  $("#input").keyup(function () {
    var text = $(this).val();
    $("#output").html(marked(text));
  });
});