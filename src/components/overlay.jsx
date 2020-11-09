import React from 'react';

import {Spinner} from './svg';

const Overlay = (props) => {
  return (
    <div className="overlay">
      <div className="overlay__background" />
      {props.children && props.children}
      {props.children ? false : <Spinner {...props} />}
      <p className="overlay__text">{props.text || 'Loading…'}</p>
    </div>
  );
};

export default React.memo(Overlay);
