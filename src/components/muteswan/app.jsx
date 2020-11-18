import React, {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useFlags} from '../../selectors';
import Actions from '../../actions';
import Footer from '../footer';
import Header from '../header';
import OverlayPassword from '../overlay-password';
import Main from '../main';

const MuteSwanApp = () => {
  const dispatch = useDispatch();
  const {isDrag, isPasswordForm} = useFlags();

  // Set connectivity status
  const onStatus = useCallback(() => {
    dispatch(
      Actions.flag({
        key: 'offline',
        value: !window.navigator.onLine,
        isTransient: true
      })
    );
  }, [dispatch]);

  // Set app context status
  const onAndroidApp = useCallback(() => {
    dispatch(
      Actions.flag({
        key: 'app',
        value: true,
        isTransient: true
      })
    );
  }, [dispatch]);

  // Request memo cleanup
  const onCleanup = useCallback(() => {
    dispatch(Actions.cleanup());
  }, [dispatch]);

  // Handle first load
  useEffect(() => {
    // Check if inside TWA app
    if (window.document.referrer.includes('android-app://')) {
      onAndroidApp();
    }

    // Listen for connectivity changes
    window.addEventListener('online', onStatus);
    window.addEventListener('offline', onStatus);
    onStatus();

    // Cleanup old memos
    onCleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPasswordSubmit = useCallback(
    async (form, password) => {
      if (password.value) {
        dispatch(Actions.pwStart(password.value));
      }

      dispatch(
        Actions.flag({key: 'passwordForm', value: false, isTransient: true})
      );
    },
    [dispatch]
  );

  const classes = ['muteswan'];

  if (isPasswordForm) {
    classes.push('muteswan--locked');
  }

  if (isDrag) {
    classes.push('muteswan--drag');
  }

  return (
    <div className={classes.join(' ')}>
      <Header />
      <Main />
      <Footer />
      {isPasswordForm && (
        <OverlayPassword
          isNew
          isDisabled={false}
          label={'New Password'}
          onSubmit={onPasswordSubmit}
        />
      )}
    </div>
  );
};

export default MuteSwanApp;
