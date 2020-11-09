import React from 'react';

import {Logo} from './svg';

/**
 * Header component
 * Can be rendered with `ReactDOMServer`
 */
const HeaderBasic = (props) => {
  let classes = ['header'];
  if (Array.isArray(props.classes)) {
    classes = classes.concat(props.classes);
  }

  return (
    <header className={classes.join(' ')}>
      <h1 className="header__text">Mute Swan</h1>
      <a className="logo" href="/">
        <span className="vh">reload page</span>
        <Logo />
      </a>
      {props.children}
    </header>
  );
};

export default React.memo(HeaderBasic);
