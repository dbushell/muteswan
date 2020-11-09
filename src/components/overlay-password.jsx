import React, {useRef, useCallback} from 'react';
import Overlay from './overlay';

const OverlayPassword = (props) => {
  const form = useRef();
  const password = useRef();

  const onSubmit = useCallback(
    (ev) => {
      ev.preventDefault();
      props.onSubmit(form.current, password.current);
    },
    [props.onSubmit, form, password]
  );

  return (
    <Overlay text={props.label}>
      <form
        ref={form}
        method="post"
        className="overlay__form"
        onSubmit={onSubmit}
      >
        <input
          disabled={props.isDisabled}
          type="text"
          name="username"
          defaultValue="muteswan"
          autoComplete="username"
          className="vh"
        />
        <input
          ref={password}
          required={!props.isNew}
          disabled={props.isDisabled}
          aria-invalid={props.isError}
          autoComplete={(props.isNew ? 'new' : 'current') + '-password'}
          type="password"
          name="password"
        />
        <input
          type="submit"
          value="Submit"
          disabled={props.isDisabled}
          className="vh"
        />
      </form>
    </Overlay>
  );
};

export default React.memo(OverlayPassword);
