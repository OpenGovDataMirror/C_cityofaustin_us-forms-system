import React from 'react';
import { format, parse } from 'date-fns';

export default function CalendarDateReviewWidget(props) {
  const date = parse(props.value);

  return <span>{format(date, 'MMMM Do, YYYY')}</span>;
}
