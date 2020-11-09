import {applyMiddleware, compose, createStore} from 'redux';
import {createMigrate, persistStore, persistReducer} from 'redux-persist';

import asyncMiddleware from './middleware/async';
import userMiddleware from './middleware/user';
import rootReducer, {defaultState} from './reducer';
import encryptedStorage from './storage';
import {migrations, migrateVersion} from './migrations';
import {persistStateKeys} from './state';

// Added by Webpack define plugin
const isDevelopment = process.env.NODE_ENV === 'development';

const persistConfig = {
  key: 'root',
  version: migrateVersion,
  storage: encryptedStorage,
  whitelist: [...persistStateKeys],
  migrate: createMigrate(migrations, {debug: isDevelopment})
};

// Add Redux dev tools with global
const key = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
const composeEnhancers = isDevelopment && window[key] ? window[key] : compose;

// Use singular instances
let store = null;
let persistor = null;

/**
 * Create and return a Redux store and persistor
 */
const configureStore = () => {
  // Return instances if configured
  if (persistor && store) {
    return {persistor, store};
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  store = createStore(
    persistedReducer,
    defaultState,
    composeEnhancers(
      applyMiddleware(asyncMiddleware),
      applyMiddleware(userMiddleware)
    )
  );

  persistor = persistStore(store);

  return {persistor, store};
};

export {configureStore};
