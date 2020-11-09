import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import Actions from '../actions';
import {useFlags} from '../selectors';
import HeaderBasic from './header-basic';
import {RedoIcon, UndoIcon} from './svg';

const Header = () => {
  const {isOffline, isUndoable, isRedoable} = useFlags();

  const dispatch = useDispatch();

  const onUndo = useCallback(() => dispatch(Actions.undo()), [dispatch]);
  const onRedo = useCallback(() => dispatch(Actions.redo()), [dispatch]);

  const classes = [];
  if (isOffline) {
    classes.push('header--offline');
  }

  return (
    <HeaderBasic classes={classes}>
      <button
        type="button"
        className="icon icon--undo"
        disabled={!isUndoable}
        onClick={onUndo}
      >
        <span className="vh">Undo</span>
        <UndoIcon />
      </button>
      <button
        type="button"
        className="icon icon--redo"
        disabled={!isRedoable}
        onClick={onRedo}
      >
        <span className="vh">Redo</span>
        <RedoIcon />
      </button>
    </HeaderBasic>
  );
};

export default React.memo(Header);
