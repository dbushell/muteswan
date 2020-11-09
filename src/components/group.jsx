import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';

import {getDragData} from '../drafters/drag';
import {useFlags} from '../selectors';
import Actions from '../actions';
import GroupHeader from './group-header';
import List from './list';

const onDragEnd = (element) => {
  if (element) {
    element.style.removeProperty('--group-height');
  }
};

const onDrag = (element) => {
  if (!element) {
    return;
  }

  const dragData = getDragData();
  if (!dragData.clientY) {
    return;
  }

  if (dragData.elements.includes(element)) {
    if (!element.style.getPropertyValue('--group-height')) {
      element.style.setProperty('--group-height', element.offsetHeight);
    }
  } else {
    onDragEnd(element);
  }

  window.requestAnimationFrame(() => onDrag(element));
};

const Group = (props) => {
  const {isDrag} = useFlags();
  const dispatch = useDispatch();
  const ref = useRef();

  const onAdd = useCallback(() => {
    dispatch(Actions.add(props.unix, props.isPerma));
  }, [dispatch, props.unix, props.isPerma]);

  useEffect(() => {
    if (ref.current) {
      if (isDrag) {
        window.requestAnimationFrame(() => onDrag(ref.current));
      } else {
        onDragEnd(ref.current);
      }
    }
  }, [ref, isDrag]);

  const classes = ['group'];
  if (props.isToday) {
    classes.push('group--today');
  }

  return (
    <section
      ref={ref}
      id={props.id}
      data-unix={props.unix}
      className={classes.join(' ')}
    >
      <GroupHeader
        isPerma={props.isPerma}
        date={new Date(props.unix)}
        onClick={onAdd}
      />
      <List items={props.items} />
    </section>
  );
};

export default React.memo(Group);
