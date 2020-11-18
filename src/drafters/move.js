import {produce, applyPatches, enablePatches} from 'immer';

enablePatches();

import Actions from '../actions';
import {selectPerma, selectDayRange} from '../selectors';
import {getMidnight} from '../utilities/datetime';

/**
 * Move an item and rearrange its parent list order
 *
 * Valid action parameters:
 *
 * * Move item to top of a list:
 *     {id, unix}
 *
 * * Move item relative to target item in any list:
 *     {id, target, position}
 *
 * * Move item to top or bottom of list (position = -1 / 1)
 *     {id, position}
 *
 */
const moveReducer = (draft, action) => {
  let {id, target, position, unix, isPerma} = action;

  // Get start timestamp of new list
  if (!unix) {
    unix = getMidnight(
      target ? draft.memos[target].unix : draft.memos[id].unix
    );
  }

  // Assume target based on context
  target = target ? target : position === -1 ? -1 : 1;

  // Return if memo is already at top of list
  const memo = draft.memos[action.id];
  if (target === 1 && memo.order === 1 && memo.unix === unix) {
    return;
  }

  // Update flags
  memo.modified = Date.now();
  memo.isPerma = Boolean(isPerma);

  // Select all memos in list
  const range = memo.isPerma
    ? selectPerma(draft, true)
    : selectDayRange(draft, unix);

  // Move memo to new list
  memo.unix = unix;

  // Return if only item
  if (range.length < 2) {
    memo.order = 1;
    return;
  }

  // Set target/position if first
  if (target === 1) {
    target = range[0].id;
    position = -1;
  }

  // Set target/position if last
  if (target === -1) {
    target = range[range.length - 1].id;
    position = 1;
  }

  // Return if target is self
  if (memo.id === target) {
    return;
  }

  // Reorder list adding moved memo into position
  // eslint-disable-next-line unicorn/no-reduce
  range.reduce((order, item) => {
    if (item.id === memo.id) {
      return order;
    }

    if (position === -1 && item.id === target) {
      memo.order = order++;
    }

    draft.memos[item.id].modified = Date.now();
    draft.memos[item.id].order = order++;

    if (position === 1 && item.id === target) {
      memo.order = order++;
    }

    return order;
  }, 1);
};

/**
 * Use patch to avoid unnecessary actions
 */
const moveDrafter = (draft, action) => {
  // Forked state changes
  const changes = [];

  // Fork state to draft possible changes
  const fork = produce(
    draft,
    (newDraft) => moveReducer(newDraft, action),
    (patches) => changes.push(...patches)
  );

  // Ignore action if no changes were made
  if (changes.length === 0) {
    if (!action.isSilent) {
      action.asyncDispatch(Actions.undo(false));
    }

    return;
  }

  let isIdentical = true;
  for (const [id, memo] of Object.entries(draft.memos)) {
    if (
      memo.unix !== fork.memos[id].unix ||
      memo.order !== fork.memos[id].order
    ) {
      isIdentical = false;
      break;
    }
  }

  // Ignore action if orders went unchanged
  if (isIdentical) {
    if (!action.isSilent) {
      action.asyncDispatch(Actions.undo(false));
    }

    return;
  }

  draft = applyPatches(draft, changes);
};

export {moveDrafter};
