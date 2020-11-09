import React, {useEffect, useRef} from 'react';

import {getDragData} from '../drafters/drag';
import {useFlags} from '../selectors';
import {Handle} from './buttons';

const updateTransform = (element) => {
  if (!element) {
    return;
  }

  const dragData = getDragData();
  if (dragData.clientY) {
    element.style.transform = `translate(0px, ${
      dragData.clientY - dragData.offsetY
    }px)`;
  }

  window.requestAnimationFrame(() => updateTransform(element));
};

const ItemPreview = () => {
  const {isDrag} = useFlags();
  const dragData = getDragData();
  const ref = useRef();

  useEffect(() => {
    if (ref.current && isDrag) {
      window.requestAnimationFrame(() => updateTransform(ref.current));
    }
  }, [ref, isDrag]);

  if (!isDrag) {
    return null;
  }

  return (
    <article ref={ref} className="item item--preview">
      <Handle isDisabled />
      <div className="memo">
        <div className="memo__text">{dragData.memo.text}</div>
      </div>
    </article>
  );
};

export default React.memo(ItemPreview);
