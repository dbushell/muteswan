import Actions, {ActionTypes} from '../actions';
import {createMemo, copyMemo} from '../state';
import {moveDrafter} from './move';

/**
 * Immer drafter to handle memo actions
 */
export const memosDrafter = (draft, action) => {
  if (action.type === ActionTypes.DELETE) {
    delete draft.memos[action.id];
    draft.deletions[action.id] = {unix: Date.now()};
    return;
  }

  if (action.type === ActionTypes.EDIT) {
    const oldMemo = draft.memos[action.id];
    draft.memos[action.id] = copyMemo(oldMemo, {
      text: action.text,
      modified: Date.now()
    });

    return;
  }

  if (action.type === ActionTypes.DONE) {
    const oldMemo = draft.memos[action.id];
    const newMemo = copyMemo(oldMemo, {
      isDone: !oldMemo.isDone,
      modified: Date.now()
    });
    draft.memos[action.id] = newMemo;
    action.asyncDispatch(
      Actions.move({
        isSilent: true,
        id: newMemo.id,
        isPerma: newMemo.isPerma,
        position: newMemo.isDone ? -1 : 1
      })
    );

    // Handle secret flags
    const flagMatch = newMemo.text.match(/--muteswan-(flag|transient):(\w+?);/);
    if (flagMatch) {
      action.asyncDispatch(
        Actions.flag({
          key: flagMatch[2],
          value: newMemo.isDone,
          isTransient: flagMatch[1] === 'transient'
        })
      );
    }

    return;
  }

  if (action.type === ActionTypes.ADD) {
    const newMemo = createMemo(action.unix, {
      isPerma: action.isPerma,
      order: 0
    });
    draft.memos[newMemo.id] = newMemo;
    action.asyncDispatch(
      Actions.move({
        isSilent: true,
        target: 1,
        id: newMemo.id,
        unix: newMemo.unix,
        isPerma: newMemo.isPerma
      })
    );

    return;
  }

  if (action.type === ActionTypes.MOVE) {
    moveDrafter(draft, action);
  }
};
