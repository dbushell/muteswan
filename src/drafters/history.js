import {ActionTypes, PurgeActions, UndoActions} from '../actions';
import {copyMemo} from '../state';

// Return `1` if undo history should be appended or `-1` if reverted
const canUndo = (state, action) => {
  // Ignore non-undoable actions
  if (!UndoActions.includes(action.type)) {
    return 0;
  }

  if (state.actions.length === 0) {
    return 0;
  }

  const previousAction = state.actions.slice(-1)[0];
  if (previousAction.type === ActionTypes.ADD) {
    if (action.type === ActionTypes.DELETE) {
      return -1;
    }

    return 0;
  }

  return 1;
};

// Clone state for undo/redo history
const cloneState = (state) => {
  const newState = {memos: {}};
  newState.deletions = {...state.deletions};
  for (const [id, memo] of Object.entries(state.memos)) {
    newState.memos[id] = copyMemo(memo);
  }

  return newState;
};

const historyDrafter = (draft, action) => {
  // Clear history after certain sync actions
  if (PurgeActions.includes(action.type)) {
    draft.undo = [];
    draft.redo = [];
    return;
  }

  // Ignore on request
  if (action.isSilent) {
    return;
  }

  // Undo history
  if (action.type === ActionTypes.UNDO && draft.undo.length > 0) {
    const undo = draft.undo.pop();
    if (action.isRedoable) {
      draft.redo.push(cloneState(draft));
    }

    draft.memos = undo.memos;
    draft.deletions = undo.deletions;
    return;
  }

  // Redo history
  if (action.type === ActionTypes.REDO && draft.redo.length > 0) {
    const redo = draft.redo.pop();
    draft.undo.push(cloneState(draft));
    draft.memos = redo.memos;
    draft.deletions = redo.deletions;
    return;
  }

  // Update undo/redo history
  const toUndo = canUndo(draft, action);
  if (toUndo !== 0) {
    if (toUndo > 0) {
      draft.undo.push(cloneState(draft));
    } else {
      draft.undo.pop();
    }

    if (draft.undo.length > 10) {
      draft.undo.splice(0, 1);
    }

    draft.redo = [];
  }

  // Update limited action history
  if (![ActionTypes.DRAG, ActionTypes.DROP].includes(action.type)) {
    draft.actions.push({...action});
    if (draft.actions.length > 3) {
      draft.actions.splice(0, 1);
    }
  }
};

export {historyDrafter};
