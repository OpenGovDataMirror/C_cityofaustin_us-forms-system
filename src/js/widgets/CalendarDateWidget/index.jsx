import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Flatpickr from 'react-flatpickr';
import { set, cloneDeep } from 'lodash';
import { isAfter, isBefore, startOfDay } from 'date-fns';

import {formatYear, formatDayMonth, parseISODate, formatISOPartialDate, setValidDate, autofillYearPast, autofillYearFuture} from './dateHelpers';

/**
  Returns datestring in the form '2011-11-22'
  Uses parts of us-form-system's DateWidget. Includes a Calendar date picker.
  ref: https://github.com/cityofaustin/us-forms-system/blob/master/src/js/widgets/DateWidget.jsx

  @param options.validation:
    "pastOnly": only allow dates set in the past
    "futureOnly": only allow dates set in the future
**/
const CalendarDateWidget = (options) => {
  return class CalendarDateWidget extends Component {

    constructor(props) {
      super(props);

      this.state = {
        value: parseISODate(this.props.value),
        touched: {
          month: false,
          day: false,
          year: false,
        },
      };
      this.onChange = this.onChange.bind(this);
      this.handleFormChange = this.handleFormChange.bind(this);
      this.handleFlatpickrChange = this.handleFlatpickrChange.bind(this);

      this.validation = options.validation;
    }

    onChange({ dates, datestring }) {
      this.props.onChange(datestring);
    }

    isIncomplete({ month, day, year }) {
      if (!month || !day || !year) {
        return true
      } else if (
        (this.validation === 'pastOnly') &&
        (isAfter(new Date(year, month - 1, day), startOfDay(new Date())))
      ) {
        return true
      } else if (
        (this.validation === 'futureOnly') &&
        (isBefore(new Date(year, month - 1, day), startOfDay(new Date())))
      ) {
        return true
      } else {
        return false
      }
    }

    handleFormChange(field, value) {
      const currentYear = (new Date()).getFullYear();

      if (field === 'month') {
        if ((value > 12)) {
          return
        }
        if (value < 1) {
          value = '';
        }
      }
      if (field === 'day') {
        if (value > 31) {
          return
        }
        if (value < 1) {
          value = '';
        }
      }
      if (field === 'year') {
        if ((this.validation == "pastOnly") && (value > currentYear)) {
          value = currentYear;
        } else if ((this.validation == "futureOnly") && (value < currentYear)) {
          // value = currentYear;
        }
        if (value < 1) {
          value = '';
        }
      }

      let newState = cloneDeep(this.state);
      const formatter = (field === 'year') ? formatYear : formatDayMonth;

      set(newState, ['value', field], formatter(value));
      set(newState, ['touched', field], true);

      // Autofill year after filling month and day
      if (
        (
          ((field === 'day') && (!!this.state.value.month)) ||
          ((field === 'month') && (!!this.state.value.day))
        ) && (!this.state.value.year)
      ) {
        let autofillYear = currentYear;
        if (this.validation == "pastOnly") {
          autofillYear = autofillYearPast(newState)
        } else if (this.validation == "futureOnly") {
          autofillYear = autofillYearFuture(newState)
        }
        set(newState, ['value', 'year'], autofillYear);
      }

      // If all 3 values are filled out, make sure they are a valid day
      if (
        !!newState.value.year &&
        !!newState.value.day &&
        !!newState.value.month
      ) {
        newState = setValidDate(newState, this.validation);
      }

      this.setState(newState, () => {
        if (this.isIncomplete(newState.value)) {
          this.props.onChange();
        } else {
          this.props.onChange(formatISOPartialDate(newState.value));
        }
      });
    }

    handleFlatpickrChange(dateString) {
      let newState = cloneDeep(this.state);
      set(newState, 'value', parseISODate(dateString));
      set(newState, 'touched', {month: true, day: true, year: true});

      this.setState(newState, () => {
        if (this.isIncomplete(newState.value)) {
          this.props.onChange();
        } else {
          this.props.onChange(formatISOPartialDate(newState.value));
        }
      })
    }

    render() {
      const {id} = this.props;
      const {month, day, year} = this.state.value;
      const flatpickrDate = (month && day && year) ?
        formatISOPartialDate({month,day,year}) : undefined;

      const flatpickrOptions = {
        dateFormat: 'Y-m-d',
        wrap: true,
        allowInput: false,
        enableTime: false,
      }
      if (this.validation == "pastOnly") {
        flatpickrOptions.maxDate = 'today';
      } else if (this.validation == "futureOnly") {
        flatpickrOptions.minDate = 'today';
      }

      return (
        <div className="date-widget-container">

          <div className="date-widget-values-container">
            <fieldset className="date-fieldset" id={id}>
              <div className="usa-date-of-birth">
                <div className="usa-datefield usa-form-group usa-form-group-month">
                  <label className="input-date-label smaller-input" htmlFor={`${id}_Month`}>Month</label>
                  <input
                    className="usa-input-inline" id={`${id}_Month`} name={`${id}_Month`}
                    type="number" min="1" max="12" value={month}
                    onChange={(event) => this.handleFormChange('month', event.target.value)}
                  />
                </div>
                <div className="usa-datefield usa-form-group usa-form-group-day">
                  <label className="input-date-label smaller-input" htmlFor={`${id}_Day`}>Day</label>
                  <input
                    className="usa-input-inline" id={`${id}_Day`} name={`${id}_Day`}
                    type="number" min="1" max="31" value={day}
                    onChange={(event) => this.handleFormChange('day', event.target.value)}
                  />
                </div>
                <div className="usa-datefield usa-form-group usa-form-group-year usa-form-group-year-fix">
                  <label className="input-date-label smaller-input" htmlFor={`${id}_Year`}>Year</label>
                  <input
                    className="usa-input-inline" id={`${id}_Year`} name={`${id}_Year`}
                    type="number" min="1900" value={year}
                    onChange={(event) => this.handleFormChange('year', event.target.value)}
                  />
                </div>
                <div aria-hidden className="usa-datefield usa-form-group flatpickr-container">
                  <Flatpickr
                    options={flatpickrOptions}
                    value={flatpickrDate}
                    onChange={(dates, datestring) => this.handleFlatpickrChange(datestring)}
                  >
                    <label className="hidden-content" htmlFor={`${id}_calendar`}>Calendar</label>
                    <input className="hidden-flatpickr-input-box" tabIndex="-1" type="text" data-input name={`${id}_calendar`} id={`${id}_calendar`}/>
                    <span className="usa-input-inline flatpickr-input-button-container" title="toggle" data-toggle>
                      <i className="material-icons flatpickr-input-button">event</i>
                    </span>
                  </Flatpickr>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      );
    }
  }

  CalendarDateWidget.propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
  };
}

export default CalendarDateWidget;
