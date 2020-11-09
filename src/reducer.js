import {produce} from 'immer';

import {ActionTypes} from './actions';
import {isExpired, getDefaultState} from './state';
import {historyDrafter} from './drafters/history';
import {dragDrafter} from './drafters/drag';
import {memosDrafter} from './drafters/memos';

// Root reducer using Immer
const rootReducer = produce((draft, action = {}) => {
  // Return new state
  if (action.type === ActionTypes.RESET) {
    return getDefaultState();
  }

  // Start async password change
  if (action.type === ActionTypes.PW_START) {
    draft.transient.isPassword = true;
    action.asyncPassword();
    return;
  }

  // End aync password change
  if (action.type === ActionTypes.PW_END) {
    draft.transient.isPassword = false;
    draft.transient.isPasswordForm = false;
  }

  // Toggle flags
  if (action.type === ActionTypes.FLAG) {
    const key = `is${action.key.replace(/^\w/, (c) => c.toUpperCase())}`;
    const prop = action.isTransient ? 'transient' : 'flags';
    if (typeof draft[prop][key] === 'boolean') {
      draft[prop][key] =
        typeof action.value === 'boolean' ? action.value : !draft[prop][key];
    }

    return;
  }

  if (action.type === ActionTypes.CLEANUP) {
    // Remove expired memos
    Object.values(draft.memos).forEach((memo) => {
      if (isExpired(memo)) {
        delete draft.memos[memo.id];
      }
    });

    // Remove expired memo deletion entries
    for (const [id, deletion] of Object.entries(draft.deletions)) {
      if (isExpired(deletion)) {
        delete draft.deletions[id];
      }
    }

    return;
  }

  // Handle undo/redo actions
  historyDrafter(draft, action);

  // Handle drag/drop actions
  dragDrafter(draft, action);

  // Handle memo actions
  memosDrafter(draft, action);
});

export const defaultState = getDefaultState();
export default rootReducer;
