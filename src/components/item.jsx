import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';

import {dragKey, getDragData} from '../drafters/drag';
import {useFlags} from '../selectors';
import Actions from '../actions';
import {Delete, Done, Handle} from './buttons';
import Memo from './memo';

// Cache `getBoundingClientRect` to improve performance
const rectCache = {};

const onDragEnd = (element) => {
  if (element) {
    element.style.removeProperty('--drop');
    delete rectCache[element.id];
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
    if (!rectCache[element.id]) {
      rectCache[element.id] = element.getBoundingClientRect();
    }

    const rect = rectCache[element.id];
    const middle = (rect.bottom - rect.top) / 2 + dragData.dropMargin / 2;
    if (dragData.clientY - rect.top < middle) {
      element.style.setProperty('--drop', -1);
      window[dragKey].position = -1;
    } else {
      element.style.setProperty('--drop', 1);
      window[dragKey].position = 1;
    }
  } else {
    onDragEnd(element);
  }

  window.requestAnimationFrame(() => onDrag(element));
};

const Item = (props) => {
  const {id: memoId, text: memoText, isDone} = props;

  const dispatch = useDispatch();
  const [isFocus, setFocus] = useState(false);
  const {isDrag} = useFlags();
  const dragData = getDragData();

  const ref = useRef();
  const handleRef = useRef();

  const isDragging = isDrag && dragData.memo.id === memoId;

  const onEdit = useCallback(
    (newText) => {
      if (newText.length === 0) {
        dispatch(Actions.delete(memoId));
      } else if (newText !== memoText) {
        dispatch(Actions.edit(memoId, newText));
      }
    },
    [dispatch, memoId, memoText]
  );

  const onDone = useCallback(() => {
    dispatch(Actions.done(memoId));
  }, [dispatch, memoId]);

  const onDelete = useCallback(() => {
    dispatch(Actions.delete(memoId));
  }, [dispatch, memoId]);

  // Use `mousedown` event to set focus to ensure blur event `relatedTarget`
  // is set to the `<button>` element
  const onDeleteDown = useCallback((ev) => {
    ev.target.focus();
    setFocus(true);
  }, []);

  const onMouseMove = useCallback((ev) => {
    ev.preventDefault();
    const {clientX, clientY} = ev;
    window[dragKey].clientX = clientX;
    window[dragKey].clientY = clientY;
    window[dragKey].elements = window.document.elementsFromPoint(
      clientX,
      clientY
    );
  }, []);

  const onTouchMove = useCallback((ev) => {
    ev.preventDefault();
    const {clientX, clientY} = ev.targetTouches[0];
    window[dragKey].clientX = clientX;
    window[dragKey].clientY = clientY;
    window[dragKey].elements = window.document.elementsFromPoint(
      clientX,
      clientY
    );
  }, []);

  const onMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    dispatch(Actions.drop({id: memoId}));
  }, [dispatch, memoId, onMouseMove]);

  const onMouseDown = useCallback(
    (ev) => {
      if (ev.button !== 0) {
        return;
      }

      ev.preventDefault();
      const rect = ref.current.getBoundingClientRect();
      const data = {
        left: rect.left,
        top: rect.top,
        offsetX: ev.offsetX,
        offsetY: ev.offsetY,
        clientX: ev.clientX,
        clientY: ev.clientY
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      dispatch(Actions.drag({id: memoId, data}));
    },
    [dispatch, ref, memoId, onMouseMove, onMouseUp]
  );

  const onTouchEnd = useCallback(() => {
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchcancel', onTouchEnd);
    window.removeEventListener('touchend', onTouchEnd);
    dispatch(Actions.drop({id: memoId}));
  }, [dispatch, memoId, onTouchMove]);

  const onTouchStart = useCallback(
    (ev) => {
      if (ev.touches.length !== 1) {
        return;
      }

      ev.preventDefault();
      const rect = ref.current.getBoundingClientRect();
      const data = {
        left: rect.left,
        top: rect.top,
        offsetX: ev.targetTouches[0].clientX - rect.left,
        offsetY: ev.targetTouches[0].clientY - rect.top,
        clientX: ev.targetTouches[0].clientX,
        clientY: ev.targetTouches[0].clientY
      };
      window.addEventListener('touchmove', onTouchMove, {passive: false});
      window.addEventListener('touchcancel', onTouchEnd);
      window.addEventListener('touchend', onTouchEnd);
      dispatch(Actions.drag({id: memoId, data}));
    },
    [dispatch, ref, memoId, onTouchMove, onTouchEnd]
  );

  useEffect(() => {
    const {current} = handleRef;
    if (current) {
      current.addEventListener('mousedown', onMouseDown);
      if ('ontouchstart' in window) {
        current.addEventListener('touchstart', onTouchStart);
      }
    }

    return () => {
      if (current) {
        current.removeEventListener('mousedown', onMouseDown);
        if ('ontouchstart' in window) {
          current.removeEventListener('touchstart', onTouchStart);
        }
      }
    };
  }, [handleRef, onMouseDown, onTouchStart]);

  useEffect(() => {
    if (ref.current) {
      if (isDrag) {
        window.requestAnimationFrame(() => onDrag(ref.current));
      } else {
        onDragEnd(ref.current);
      }
    }
  }, [ref, isDrag]);

  const classes = ['item'];
  if (isDone) {
    classes.push('item--done');
  }

  if (isDragging) {
    classes.push('item--drag');
  }

  return (
    <article ref={ref} id={memoId} className={classes.join(' ')}>
      <Handle ref={handleRef} isDisabled={isFocus} />
      <Memo
        id={memoId}
        text={memoText}
        isDisabled={isDone}
        {...{isFocus, setFocus}}
        onEdit={onEdit}
      />
      {isFocus === false && (
        <Done isDisabled={isDragging} isPressed={isDone} onClick={onDone} />
      )}
      {isFocus === true && (
        <Delete
          isDisabled={isDragging}
          onMouseDown={onDeleteDown}
          onClick={onDelete}
        />
      )}
    </article>
  );
};

export default React.memo(Item);
