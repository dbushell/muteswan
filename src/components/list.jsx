import React from 'react';

import Item from './item';

const List = (props) => {
  if (props.items.length === 0) {
    return null;
  }

  return (
    <div className="list">
      {props.items.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
};

export default React.memo(List);
