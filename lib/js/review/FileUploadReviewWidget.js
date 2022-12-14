'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FileUploadReviewWidget;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FileUploadReviewWidget(props) {
  if (!props.value) return null;

  var files = JSON.parse(props.value);

  return _react2.default.createElement(
    'ul',
    null,
    files.map(function (f) {
      return _react2.default.createElement(
        'li',
        { key: f },
        f
      );
    })
  );
}
//# sourceMappingURL=FileUploadReviewWidget.js.map