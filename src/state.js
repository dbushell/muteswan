import {ActionTypes} from './actions';
import {getMidnight} from './utilities/datetime';
import hashsum from './utilities/hashsum';

// Return true if the state object is older than seven days
export const isExpired = (object) => {
  if (object.isPerma === true) {
    return false;
  }

  return getMidnight() - object.unix > 86400000 * 7;
};

// Create a default memo then inherit props from zero or more references
export const createMemo = (unix, ...props) => {
  unix = unix || getMidnight();
  let memo = Object.assign(Object.create(null), {
    unix,
    modified: Date.now(),
    id: hashsum(unix + Math.random()),
    text: '',
    isDone: false,
    isPerma: false,
    order: 1
  });
  props.forEach((newProps) => {
    if (typeof newProps === 'object') {
      memo = Object.assign(memo, newProps);
    }
  });
  return memo;
};

// Shorthand for `createMemo(null, ...);`
export const copyMemo = (...props) => createMemo(null, ...props);

// State to persist in local storage
export const persistStateKeys = ['deletions', 'flags', 'memos'];

// Return a new default state object
export const getDefaultState = () => {
  const unix = getMidnight();
  const memos = [
    createMemo(unix - 86400000 * 8, {
      text: 'Very old memos are cleaned up'
    }),
    createMemo(unix + 86400000 * 8, {
      text: 'Memos in this list are permanent',
      isPerma: true
    }),
    createMemo(unix, {
      text: 'Tap a day to add a memo'
    }),
    createMemo(unix, {
      text: 'Install Mute Swan',
      isDone: true
    }),
    createMemo(unix - 86400000, {
      text: 'Old memos are kept for a week',
      isDone: true
    })
  ];
  const state = {
    memos: {},
    undo: [],
    redo: [],
    actions: [{type: ActionTypes.NOOP}],
    deletions: {},
    flags: {},
    transient: {
      isApp: false,
      isDrag: false,
      isOffline: false,
      isPassword: false,
      isPasswordForm: false
    }
  };
  memos.forEach((memo) => {
    state.memos[memo.id] = memo;
  });
  return state;
};
