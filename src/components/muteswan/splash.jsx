import React from 'react';

import HeaderBasic from '../header-basic';
import Overlay from '../overlay';

/**
 * Placeholder root component
 * Can be rendered with `ReactDOMServer`
 */
const MuteSwanSplash = () => {
  return (
    <div className="muteswan">
      <HeaderBasic />
      <Overlay />
    </div>
  );
};

export default React.memo(MuteSwanSplash);
