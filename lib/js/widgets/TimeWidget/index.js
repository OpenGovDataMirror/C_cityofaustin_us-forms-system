'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TimeInput = require('./TimeInput');

var _TimeInput2 = _interopRequireDefault(_TimeInput);

var _timeHelpers = require('./timeHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Returns datestring in the form "2011-11-11"
// Uses parts of us-form-system's DateWidget. Includes a Calendar date picker.
// ref: https://github.com/cityofaustin/us-forms-system/blob/master/src/js/widgets/DateWidget.jsx
var TimeWidget = function (_React$Component) {
  _inherits(TimeWidget, _React$Component);

  function TimeWidget(props) {
    _classCallCheck(this, TimeWidget);

    var _this = _possibleConstructorReturn(this, (TimeWidget.__proto__ || Object.getPrototypeOf(TimeWidget)).call(this, props));

    _this.state = {
      value: (0, _timeHelpers.parseTime)(props.value),
      touched: {
        hour: false,
        minute: false
      }
    };
    _this.onChange = _this.onChange.bind(_this);
    _this.handleTimeChange = _this.handleTimeChange.bind(_this);
    _this.handlePeriodChange = _this.handlePeriodChange.bind(_this);
    return _this;
  }

  _createClass(TimeWidget, [{
    key: 'onChange',
    value: function onChange(_ref) {
      var dates = _ref.dates,
          datestring = _ref.datestring;

      this.props.onChange(datestring);
    }
  }, {
    key: 'isIncomplete',
    value: function isIncomplete(_ref2) {
      var hour = _ref2.hour,
          minute = _ref2.minute;

      return !hour || !minute;
    }
  }, {
    key: 'handleTimeChange',
    value: function handleTimeChange(field, value) {
      var _this2 = this;

      // Only allow integer values
      if (value !== '' && !/^\d+$/.test(value) && value.length <= 2) {
        return;
      }
      if (field === 'hour') {
        if (value > 12) {
          return;
        }
        if (value < 1) {
          value = '';
        }
      }
      if (field === 'minute') {
        if (value > 59 || value < 0) {
          return;
        }
      }

      var newState = (0, _cloneDeep3.default)(this.state);
      (0, _set3.default)(newState, ['value', field], (0, _timeHelpers.formatHourMinute)(value));
      (0, _set3.default)(newState, ['touched', field], true);

      // Autofill minute after filling hour
      if (field === 'hour' && this.state.value.minute === '') {
        (0, _set3.default)(newState, ['value', 'minute'], '00');
      }

      this.setState(newState, function () {
        if (_this2.isIncomplete(newState.value)) {
          _this2.props.onChange();
        } else {
          _this2.props.onChange((0, _timeHelpers.formatTime)(newState.value));
        }
      });
    }
  }, {
    key: 'handlePeriodChange',
    value: function handlePeriodChange(period) {
      var _this3 = this;

      var newState = (0, _cloneDeep3.default)(this.state);
      (0, _set3.default)(newState, ['value', 'period'], period);

      this.setState(newState, function () {
        if (_this3.isIncomplete(newState.value)) {
          _this3.props.onChange();
        } else {
          _this3.props.onChange((0, _timeHelpers.formatTime)(newState.value));
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var id = this.props.id;
      var _state$value = this.state.value,
          hour = _state$value.hour,
          minute = _state$value.minute,
          period = _state$value.period;

      // <span> state time: {formatTime({hour,minute,period})} </span><br/>

      return _react2.default.createElement(
        'div',
        { className: 'time-widget-container' },
        _react2.default.createElement(
          'fieldset',
          { className: 'date-fieldset', id: id },
          _react2.default.createElement(_TimeInput2.default, {
            id: id,
            type: 'Hour',
            onChange: this.handleTimeChange,
            value: hour,
            label: 'Hour' }),
          _react2.default.createElement(_TimeInput2.default, {
            id: id,
            type: 'Minute',
            onChange: this.handleTimeChange,
            value: minute,
            label: 'Minute' }),
          _react2.default.createElement(
            'div',
            { className: 'usa-datefield usa-form-group time-period-select-container' },
            _react2.default.createElement(
              'label',
              { className: 'hidden-content', htmlFor: id + '_time_of_day' },
              'Time of Day'
            ),
            _react2.default.createElement(
              'select',
              {
                className: 'usa-input-inline', name: id + '_time_of_day', id: id + '_time_of_day',
                onChange: function onChange(event) {
                  return _this4.handlePeriodChange(event.target.value);
                } },
              _react2.default.createElement(
                'option',
                { value: 'am' },
                'am'
              ),
              _react2.default.createElement(
                'option',
                { value: 'pm' },
                'pm'
              )
            )
          )
        )
      );
    }
  }]);

  return TimeWidget;
}(_react2.default.Component);

exports.default = TimeWidget;


TimeWidget.propTypes = {
  id: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func.isRequired,
  value: _propTypes2.default.string
};
//# sourceMappingURL=index.js.map