'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ReviewLocationWidget;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ReviewLocationWidget(props) {
  var valueJSON = props.value ? props.value : props.schema.formData;
  var location = JSON.parse(valueJSON);
  // mapbox static map styles
  var MAPBOX_TOKEN = 'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw';
  var markerColor = '0050d7';
  var markerOverlay = 'pin-l+' + markerColor + '(' + location.position.lng + ',' + location.position.lat + ')';
  var zoom = 15;
  var width = 680;
  var height = 400;
  // eslint-disable-next-line max-len
  var staticMap = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/' + markerOverlay + '/' + location.position.lng + ',' + location.position.lat + ',' + zoom + '/' + width + 'x' + height + '?access_token=' + MAPBOX_TOKEN;

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement('img', { src: staticMap, alt: location.address }),
    _react2.default.createElement(
      'div',
      null,
      location.address
    )
  );
}
//# sourceMappingURL=ReviewLocationWidget.js.map