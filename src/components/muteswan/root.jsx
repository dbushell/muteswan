import React, {useCallback, useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {configureStore} from '../../store';
import {isDataProtected} from '../../storage';
import MuteSwanApp from './app';
import MuteSwanLogin from './login';
import MuteSwanSplash from './splash';

const MuteSwan = () => {
  const [isSplash, setSplash] = useState(true);
  const [isLogin, setLogin] = useState(true);

  const onLoad = useCallback(async () => {
    const isProtected = await isDataProtected();
    setLogin(isProtected);
    setSplash(false);
  }, []);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  // Return splash screen to hydrate the app
  if (isSplash) {
    return <MuteSwanSplash />;
  }

  // Return the login screen if storage is password protected
  if (isLogin) {
    return <MuteSwanLogin onSuccess={() => setLogin(false)} />;
  }

  const {store, persistor} = configureStore();

  return (
    <Provider store={store}>
      <PersistGate loading={<MuteSwanSplash />} persistor={persistor}>
        <MuteSwanApp />
      </PersistGate>
    </Provider>
  );
};

export default MuteSwan;
