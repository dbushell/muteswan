import {useSelector, shallowEqual} from 'react-redux';

import hashsum from './utilities/hashsum';
import {getMidnight} from './utilities/datetime';

// Sort list by order timestamp
const sortOrder = ({order: a}, {order: b}) => (a > b ? 1 : a < b ? -1 : 0);

// Return items filtered by permanent flag
const selectPerma = (state, isPerma) =>
  Object.values(state.memos)
    .filter((memo) => Boolean(memo.isPerma) === isPerma)
    .sort(sortOrder);

// Return array of state items within a timestamp range
const selectRange = (state, start, end) =>
  selectPerma(state, false)
    .filter((memo) => memo.unix >= start && memo.unix < end)
    .sort(sortOrder);

// Return range array for one day
const selectDayRange = (state, start) => {
  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + 1);
  return selectRange(state, start, endDate.getTime());
};

// Return array of objects for upcoming days
const selectFutureGroups = (state) => {
  const midnight = getMidnight();
  const groups = [];
  for (let i = 6; i >= 0; i--) {
    const startDate = new Date(midnight);
    startDate.setHours(startDate.getHours() + 24 * i);
    const unix = startDate.getTime();
    const items = selectDayRange(state, unix);
    const id = hashsum(unix);
    groups.push({
      id,
      unix,
      items,
      isToday: unix === midnight
    });
  }

  return groups;
};

// Return array of objects for past days
const selectHistoryGroups = (state) => {
  const midnight = getMidnight();
  const groups = [];
  for (let i = 1; i < 8; i++) {
    const startDate = new Date(midnight);
    startDate.setHours(startDate.getHours() - 24 * i);
    const unix = startDate.getTime();
    const items = selectDayRange(state, unix);
    if (items.length === 0) {
      continue;
    }

    const id = hashsum(unix);
    groups.push({
      isPerma: false,
      id,
      unix,
      items
    });
  }

  return groups;
};

// Return array of objects for permanent lists
const selectPermaGroups = (state) => [
  {
    isPerma: true,
    id: 'permanent',
    unix: new Date('1987-05-21').getTime(),
    items: selectPerma(state, true)
  }
];

// Return session flags
const selectTransient = (state) => ({
  ...state.transient,
  isUndoable: state.undo.length > 0,
  isRedoable: state.redo.length > 0
});

// Return persisted flags
const selectFlags = (state) => ({...selectTransient(state), ...state.flags});

const useTransient = () => useSelector(selectTransient, shallowEqual);

const useFlags = () => useSelector(selectFlags, shallowEqual);

const useFutureGroups = () => useSelector(selectFutureGroups, shallowEqual);
const useHistoryGroups = () => useSelector(selectHistoryGroups, shallowEqual);
const usePermaGroups = () => useSelector(selectPermaGroups, shallowEqual);

export {
  selectPerma,
  selectRange,
  selectDayRange,
  useFlags,
  useTransient,
  useFutureGroups,
  useHistoryGroups,
  usePermaGroups
};
