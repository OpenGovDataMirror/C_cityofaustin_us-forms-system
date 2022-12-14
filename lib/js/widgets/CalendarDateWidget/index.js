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

var _reactFlatpickr = require('react-flatpickr');

var _reactFlatpickr2 = _interopRequireDefault(_reactFlatpickr);

var _dateFns = require('date-fns');

var _dateHelpers = require('./dateHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
  Returns datestring in the form '2011-11-22'
  Uses parts of us-form-system's DateWidget. Includes a Calendar date picker.
  ref: https://github.com/cityofaustin/us-forms-system/blob/master/src/js/widgets/DateWidget.jsx

  @param options.validation:
    "pastOnly": only allow dates set in the past
    "futureOnly": only allow dates set in the future
**/
var CalendarDateWidget = function CalendarDateWidget(options) {
  return function (_Component) {
    _inherits(CalendarDateWidget, _Component);

    function CalendarDateWidget(props) {
      _classCallCheck(this, CalendarDateWidget);

      var _this = _possibleConstructorReturn(this, (CalendarDateWidget.__proto__ || Object.getPrototypeOf(CalendarDateWidget)).call(this, props));

      _this.state = {
        value: (0, _dateHelpers.parseISODate)(_this.props.value),
        touched: {
          month: false,
          day: false,
          year: false
        }
      };
      _this.onChange = _this.onChange.bind(_this);
      _this.handleFormChange = _this.handleFormChange.bind(_this);
      _this.handleFlatpickrChange = _this.handleFlatpickrChange.bind(_this);

      _this.validation = options.validation;
      return _this;
    }

    _createClass(CalendarDateWidget, [{
      key: 'onChange',
      value: function onChange(_ref) {
        var dates = _ref.dates,
            datestring = _ref.datestring;

        this.props.onChange(datestring);
      }
    }, {
      key: 'isIncomplete',
      value: function isIncomplete(_ref2) {
        var month = _ref2.month,
            day = _ref2.day,
            year = _ref2.year;

        console.log("~~ isIncomplete???");
        if (!month || !day || !year) {
          console.log("~~ Missing values!!");
          return true;
        } else if (this.validation === 'pastOnly' && (0, _dateFns.isAfter)(new Date(year, month - 1, day), (0, _dateFns.startOfDay)(new Date()))) {
          console.log("Safely in the past.");
          return true;
        } else if (this.validation === 'futureOnly' && (0, _dateFns.isBefore)(new Date(year, month - 1, day), (0, _dateFns.startOfDay)(new Date()))) {
          console.log('isBefore1: ' + new Date(year, month - 1, day));
          console.log('isBefore2: ' + new Date());
          console.log('isBefore?: ' + (0, _dateFns.isBefore)(new Date(year, month - 1, day), new Date()));
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: 'handleFormChange',
      value: function handleFormChange(field, value) {
        var _this2 = this;

        var currentYear = new Date().getFullYear();

        if (field === 'month') {
          if (value > 12) {
            return;
          }
          if (value < 1) {
            value = '';
          }
        }
        if (field === 'day') {
          if (value > 31) {
            return;
          }
          if (value < 1) {
            value = '';
          }
        }
        if (field === 'year') {
          if (this.validation == "pastOnly" && value > currentYear) {
            value = currentYear;
          } else if (this.validation == "futureOnly" && value < currentYear) {
            // value = currentYear;
          }
          if (value < 1) {
            value = '';
          }
        }

        var newState = (0, _cloneDeep3.default)(this.state);
        var formatter = field === 'year' ? _dateHelpers.formatYear : _dateHelpers.formatDayMonth;

        (0, _set3.default)(newState, ['value', field], formatter(value));
        (0, _set3.default)(newState, ['touched', field], true);

        // Autofill year after filling month and day
        if ((field === 'day' && !!this.state.value.month || field === 'month' && !!this.state.value.day) && !this.state.value.year) {
          var autofillYear = currentYear;
          if (this.validation == "pastOnly") {
            autofillYear = (0, _dateHelpers.autofillYearPast)(newState);
          } else if (this.validation == "futureOnly") {
            autofillYear = (0, _dateHelpers.autofillYearFuture)(newState);
          }
          (0, _set3.default)(newState, ['value', 'year'], autofillYear);
        }

        // If all 3 values are filled out, make sure they are a valid day
        if (!!newState.value.year && !!newState.value.day && !!newState.value.month) {
          newState = (0, _dateHelpers.setValidDate)(newState, this.validation);
        }

        this.setState(newState, function () {
          if (_this2.isIncomplete(newState.value)) {
            _this2.props.onChange();
          } else {
            _this2.props.onChange((0, _dateHelpers.formatISOPartialDate)(newState.value));
          }
        });
      }
    }, {
      key: 'handleFlatpickrChange',
      value: function handleFlatpickrChange(dateString) {
        var _this3 = this;

        var newState = (0, _cloneDeep3.default)(this.state);
        (0, _set3.default)(newState, 'value', (0, _dateHelpers.parseISODate)(dateString));
        (0, _set3.default)(newState, 'touched', { month: true, day: true, year: true });

        this.setState(newState, function () {
          if (_this3.isIncomplete(newState.value)) {
            _this3.props.onChange();
          } else {
            _this3.props.onChange((0, _dateHelpers.formatISOPartialDate)(newState.value));
          }
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this4 = this;

        var id = this.props.id;
        var _state$value = this.state.value,
            month = _state$value.month,
            day = _state$value.day,
            year = _state$value.year;

        var flatpickrDate = month && day && year ? (0, _dateHelpers.formatISOPartialDate)({ month: month, day: day, year: year }) : undefined;

        var flatpickrOptions = {
          dateFormat: 'Y-m-d',
          wrap: true,
          allowInput: false,
          enableTime: false
        };
        if (this.validation == "pastOnly") {
          flatpickrOptions.maxDate = 'today';
        } else if (this.validation == "futureOnly") {
          flatpickrOptions.minDate = 'today';
        }

        return _react2.default.createElement(
          'div',
          { className: 'date-widget-container' },
          _react2.default.createElement(
            'div',
            { className: 'date-widget-values-container' },
            _react2.default.createElement(
              'fieldset',
              { className: 'date-fieldset', id: id },
              _react2.default.createElement(
                'div',
                { className: 'usa-date-of-birth' },
                _react2.default.createElement(
                  'div',
                  { className: 'usa-datefield usa-form-group usa-form-group-month' },
                  _react2.default.createElement(
                    'label',
                    { className: 'input-date-label smaller-input', htmlFor: id + '_Month' },
                    'Month'
                  ),
                  _react2.default.createElement('input', {
                    className: 'usa-input-inline', id: id + '_Month', name: id + '_Month',
                    type: 'number', min: '1', max: '12', value: month,
                    onChange: function onChange(event) {
                      return _this4.handleFormChange('month', event.target.value);
                    }
                  })
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'usa-datefield usa-form-group usa-form-group-day' },
                  _react2.default.createElement(
                    'label',
                    { className: 'input-date-label smaller-input', htmlFor: id + '_Day' },
                    'Day'
                  ),
                  _react2.default.createElement('input', {
                    className: 'usa-input-inline', id: id + '_Day', name: id + '_Day',
                    type: 'number', min: '1', max: '31', value: day,
                    onChange: function onChange(event) {
                      return _this4.handleFormChange('day', event.target.value);
                    }
                  })
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'usa-datefield usa-form-group usa-form-group-year usa-form-group-year-fix' },
                  _react2.default.createElement(
                    'label',
                    { className: 'input-date-label smaller-input', htmlFor: id + '_Year' },
                    'Year'
                  ),
                  _react2.default.createElement('input', {
                    className: 'usa-input-inline', id: id + '_Year', name: id + '_Year',
                    type: 'number', min: '1900', value: year,
                    onChange: function onChange(event) {
                      return _this4.handleFormChange('year', event.target.value);
                    }
                  })
                ),
                _react2.default.createElement(
                  'div',
                  { 'aria-hidden': true, className: 'usa-datefield usa-form-group flatpickr-container' },
                  _react2.default.createElement(
                    _reactFlatpickr2.default,
                    {
                      options: flatpickrOptions,
                      value: flatpickrDate,
                      onChange: function onChange(dates, datestring) {
                        return _this4.handleFlatpickrChange(datestring);
                      }
                    },
                    _react2.default.createElement(
                      'label',
                      { className: 'hidden-content', htmlFor: id + '_calendar' },
                      'Calendar'
                    ),
                    _react2.default.createElement('input', { className: 'hidden-flatpickr-input-box', tabIndex: '-1', type: 'text', 'data-input': true, name: id + '_calendar', id: id + '_calendar' }),
                    _react2.default.createElement(
                      'span',
                      { className: 'usa-input-inline flatpickr-input-button-container', title: 'toggle', 'data-toggle': true },
                      _react2.default.createElement(
                        'i',
                        { className: 'material-icons flatpickr-input-button' },
                        'event'
                      )
                    )
                  )
                )
              )
            )
          )
        );
      }
    }]);

    return CalendarDateWidget;
  }(_react.Component);

  CalendarDateWidget.propTypes = {
    id: _propTypes2.default.string.isRequired,
    onChange: _propTypes2.default.func.isRequired,
    value: _propTypes2.default.string
  };
};

exports.default = CalendarDateWidget;
//# sourceMappingURL=index.js.map