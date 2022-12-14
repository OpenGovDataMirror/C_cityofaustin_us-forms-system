'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeInput;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TimeInput(props) {
  var id = props.id,
      type = props.type,
      _onChange = props.onChange,
      label = props.label,
      value = props.value;


  return _react2.default.createElement(
    'div',
    { className: 'usa-datefield usa-form-group usa-form-group-day' },
    _react2.default.createElement(
      'label',
      { className: 'input-date-label smaller-input', htmlFor: id + '_' + type },
      label
    ),
    _react2.default.createElement('input', {
      className: 'usa-input-inline', id: id + '_' + type, name: id + '_' + type,
      type: 'number', step: '1', pattern: '^\\d+$', min: '0', max: '60', value: value,
      onChange: function onChange(event) {
        return _onChange(type.toLowerCase(), event.target.value);
      } })
  );
}

TimeInput.propTypes = {
  id: _propTypes2.default.string.isRequired,
  type: _propTypes2.default.string.isRequired, // "Hour" or "Minute"
  onChange: _propTypes2.default.func.isRequired,
  value: _propTypes2.default.string,
  label: _propTypes2.default.string
};
//# sourceMappingURL=TimeInput.js.map