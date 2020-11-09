// Constants
const ActionTypes = {
  NOOP: '🦢/NOOP',
  FLAG: '🦢/FLAG',
  RESET: '🦢/RESET',
  CLEANUP: '🦢/CLEANUP',
  DELETE: '🦢/DELETE',
  EDIT: '🦢/EDIT',
  DONE: '🦢/DONE',
  ADD: '🦢/ADD',
  MOVE: '🦢/MOVE',
  UNDO: '🦢/UNDO',
  REDO: '🦢/REDO',
  DRAG: '🦢/DRAG',
  DROP: '🦢/DROP',
  PW_START: '🦢/PW/START',
  PW_END: '🦢/PW/END'
};

Object.freeze(ActionTypes);

// Actions that update the undo/redo history
const UndoActions = [
  ActionTypes.ADD,
  ActionTypes.DELETE,
  ActionTypes.EDIT,
  ActionTypes.DONE,
  ActionTypes.MOVE
];
Object.freeze(UndoActions);

// Actions that purge the undo/redo history
const PurgeActions = [ActionTypes.PW_END];
Object.freeze(PurgeActions);

// Action creator functions
const Actions = {
  pwStart(value) {
    return {type: ActionTypes.PW_START, value, isSilent: true};
  },
  pwEnd({isSuccess, newChecksum}) {
    isSuccess = Boolean(isSuccess);
    return {type: ActionTypes.PW_END, isSuccess, newChecksum, isSilent: true};
  },
  flag({key, value, isTransient}) {
    isTransient = Boolean(isTransient);
    return {type: ActionTypes.FLAG, key, value, isTransient};
  },
  undo(isRedoable) {
    // True unless explicitly defined
    isRedoable = isRedoable !== false;
    return {type: ActionTypes.UNDO, isRedoable};
  },
  redo() {
    return {type: ActionTypes.REDO};
  },
  reset() {
    return {type: ActionTypes.RESET};
  },
  cleanup() {
    return {type: ActionTypes.CLEANUP};
  },
  add(unix, isPerma) {
    isPerma = Boolean(isPerma);
    return {type: ActionTypes.ADD, unix, isPerma};
  },
  delete(id) {
    return {type: ActionTypes.DELETE, id};
  },
  edit(id, text) {
    return {type: ActionTypes.EDIT, id, text};
  },
  done(id) {
    return {type: ActionTypes.DONE, id};
  },
  move({id, target, unix, position, isPerma, isSilent}) {
    // False if not explicitly defined
    isSilent = Boolean(isSilent);
    isPerma = Boolean(isPerma);
    return {
      type: ActionTypes.MOVE,
      id,
      target,
      unix,
      position,
      isPerma,
      isSilent
    };
  },
  drag({id, data}) {
    return {type: ActionTypes.DRAG, id, data};
  },
  drop({id}) {
    return {type: ActionTypes.DROP, id};
  }
};

Object.freeze(Actions);

export {ActionTypes, PurgeActions, UndoActions};
export default Actions;
