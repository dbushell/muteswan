/**
 * Add `asyncDispatch` method to actions to dispatch after reducer
 */
const asyncMiddleware = (store) => (next) => (action) => {
  let isFlushable = false;
  let actionQueue = [];
  const flushQueue = () => {
    if (isFlushable) {
      actionQueue.forEach((queuedAction) => store.dispatch(queuedAction));
      actionQueue = [];
    }
  };

  action.asyncDispatch = (asyncAction) => {
    actionQueue = [...actionQueue, asyncAction];
    flushQueue();
  };

  next(action);
  isFlushable = true;
  flushQueue();
};

export default asyncMiddleware;
