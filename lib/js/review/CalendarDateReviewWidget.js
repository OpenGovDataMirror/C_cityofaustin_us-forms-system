'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CalendarDateReviewWidget;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dateFns = require('date-fns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CalendarDateReviewWidget(props) {
  var date = (0, _dateFns.parse)(props.value);

  return _react2.default.createElement(
    'span',
    null,
    (0, _dateFns.format)(date, 'MMMM Do, YYYY')
  );
}
//# sourceMappingURL=CalendarDateReviewWidget.js.map