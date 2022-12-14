import PropTypes from 'prop-types';
import React from 'react';
import { set, cloneDeep } from 'lodash';

import TimeInput from './TimeInput';
import { formatHourMinute, parseTime, formatTime } from './timeHelpers';

// Returns datestring in the form "2011-11-11"
// Uses parts of us-form-system's DateWidget. Includes a Calendar date picker.
// ref: https://github.com/cityofaustin/us-forms-system/blob/master/src/js/widgets/DateWidget.jsx
export default class TimeWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: parseTime(props.value),
      touched: {
        hour: false,
        minute: false,
      },
    };
    this.onChange = this.onChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handlePeriodChange = this.handlePeriodChange.bind(this);
  }

  onChange({ dates, datestring }) {
    this.props.onChange(datestring);
  }

  isIncomplete({ hour, minute }) {
    return (!hour || !minute);
  }

  handleTimeChange(field, value) {
    // Only allow integer values
    if ((value !== '') && (!/^\d+$/.test(value)) && (value.length <= 2)) {
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
      if ((value > 59) || (value < 0)) {
        return;
      }
    }

    const newState = cloneDeep(this.state);
    set(newState, ['value', field], formatHourMinute(value));
    set(newState, ['touched', field], true);

    // Autofill minute after filling hour
    if ((field === 'hour') && (this.state.value.minute === '')) {
      set(newState, ['value', 'minute'], '00');
    }

    this.setState(newState, () => {
      if (this.isIncomplete(newState.value)) {
        this.props.onChange();
      } else {
        this.props.onChange(formatTime(newState.value));
      }
    });
  }

  handlePeriodChange(period) {
    const newState = cloneDeep(this.state);
    set(newState, ['value', 'period'], period);

    this.setState(newState, () => {
      if (this.isIncomplete(newState.value)) {
        this.props.onChange();
      } else {
        this.props.onChange(formatTime(newState.value));
      }
    });
  }

  render() {
    const { id } = this.props;
    const { hour, minute, period } = this.state.value;

    // <span> state time: {formatTime({hour,minute,period})} </span><br/>
    return (
      <div className="time-widget-container">
        <fieldset className="date-fieldset" id={id}>
          <TimeInput
            id={id}
            type={'Hour'}
            onChange={this.handleTimeChange}
            value={hour}
            label={'Hour'}/>
          <TimeInput
            id={id}
            type={'Minute'}
            onChange={this.handleTimeChange}
            value={minute}
            label={'Minute'}/>
          <div className="usa-datefield usa-form-group time-period-select-container">
            <label className="hidden-content" htmlFor={`${id}_time_of_day`}>Time of Day</label>
            <select
              className="usa-input-inline" name={`${id}_time_of_day`} id={`${id}_time_of_day`}
              onChange={event => this.handlePeriodChange(event.target.value)}>
              <option value="am">am</option>
              <option value="pm">pm</option>
            </select>
          </div>
        </fieldset>
      </div>
    );
  }
}

TimeWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};
