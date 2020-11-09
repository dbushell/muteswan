import React from 'react';

import {DeleteIcon, DoneIcon, DragIcon} from './svg';

export const Handle = React.memo(
  React.forwardRef(({isDisabled}, ref) => {
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className="icon icon--handle"
        type="button"
      >
        <span className="vh">Drag</span>
        <DragIcon />
      </button>
    );
  })
);

export const Done = React.memo(({isDisabled, isPressed, onClick}) => {
  return (
    <button
      disabled={isDisabled}
      aria-pressed={isPressed}
      className="icon icon--done"
      type="button"
      onClick={onClick}
    >
      <span className="vh">Done</span>
      <DoneIcon />
    </button>
  );
});

export const Delete = React.memo(({isDisabled, onClick, onMouseDown}) => {
  return (
    <button
      className="icon icon--delete"
      type="button"
      disabled={isDisabled}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <span className="vh">Delete</span>
      <DeleteIcon />
    </button>
  );
});
