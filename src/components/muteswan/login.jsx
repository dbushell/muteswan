import React, {useCallback, useEffect, useState} from 'react';

import {activatePassword} from '../../storage';
import HeaderBasic from '../header-basic';
import Overlay from '../overlay';
import OverlayPassword from '../overlay-password';

const MuteSwanLogin = (props) => {
  const [isValidating, setValidating] = useState(true);
  const [isError, setError] = useState(false);

  const {onSuccess} = props;

  // Handle password form submissions
  const onSubmit = useCallback(
    async (form, password) => {
      setError(false);
      setValidating(true);
      let data = null;
      if ('PasswordCredential' in window) {
        data = new window.PasswordCredential(form);
      }

      if (await activatePassword(password.value)) {
        if (data) {
          window.navigator.credentials.store(data);
        }

        onSuccess();
      } else {
        setTimeout(() => {
          setError(true);
          setValidating(false);
          password.focus();
        }, 1000);
      }
    },
    [onSuccess]
  );

  // Attempt to auto-login on first load
  const autoLogin = useCallback(async () => {
    try {
      const data = await window.navigator.credentials.get({
        password: true,
        mediation: 'optional'
      });
      if (data) {
        if (await activatePassword(data.password)) {
          onSuccess();
          return;
        }

        setError(true);
      }
    } catch (error) {
      console.log(error);
      window.document.addEventListener(
        'input',
        (ev) => {
          if (
            ev.target.name === 'password' &&
            ev.inputType === 'insertReplacementText'
          ) {
            onSubmit(ev.target.parentNode, ev.target);
          }
        },
        {once: true}
      );
    }

    setValidating(false);
  }, [onSubmit, onSuccess]);

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  return (
    <div className="muteswan">
      <HeaderBasic />
      {isValidating ? <Overlay /> : null}
      {isValidating ? null : (
        <OverlayPassword
          label={'Unlock'}
          isDisabled={isValidating}
          isError={isError}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

export default MuteSwanLogin;
