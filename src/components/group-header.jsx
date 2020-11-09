import React from 'react';

import {getDateFormat} from '../utilities/datetime';

const GroupHeader = (props) => {
  const date = getDateFormat(props.date);
  if (props.isPerma) {
    date.dddd = <span className="vh">Permanent</span>;
    date.DD = '∞';
  }

  return (
    <h2 className="date" tabIndex="0" onClick={props.onClick}>
      <time className="date__time" dateTime={date.ISO}>
        <span className="date__day">{date.dddd}</span>
        <span className="date__num">{date.DD}</span>
      </time>
    </h2>
  );
};

export default React.memo(GroupHeader);
