import React, {useCallback, useEffect, useRef, useState} from 'react';

const Memo = (props) => {
  const [text, setText] = useState(props.text || '');
  const ref = useRef();

  // Reset internal state to Redux state when out of focus
  if (!props.isFocus && text !== props.text) {
    setText(props.text);
  }

  const onHeight = useCallback(() => {
    window.requestAnimationFrame(() => {
      const element = ref.current;
      if (element) {
        element.style.removeProperty('--height');
        element.style.setProperty('--height', element.scrollHeight);
      }
    });
  }, [ref]);

  // Auto-rezize `<textarea>` element
  useEffect(onHeight, [text]);

  useEffect(() => {
    // Focus `<textarea>` when adding new item
    if (props.isFocus !== true && text === '') {
      ref.current.focus();
    }

    // Setup Observer on mount
    let oldWidth = 0;
    let observer = null;

    if ('ResizeObserver' in window) {
      observer = new window.ResizeObserver((entries) => {
        const newWidth = entries[0].contentRect.width;
        if (oldWidth !== newWidth) {
          oldWidth = newWidth;
          onHeight();
        }
      });
      observer.observe(window.document.documentElement);
    }

    // Disconnect Observer on dismount
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [ref]);

  // Handle `<textarea>` event
  const onFocus = useCallback(() => {
    props.setFocus(true);
  }, [props.setFocus]);

  // Handle `<textarea>` event
  // Trim whitespace and newlines
  // Use callback to update Redux state unless delete button was clicked
  const onBlur = useCallback(
    (ev) => {
      props.setFocus(false);
      if (
        ev.relatedTarget &&
        ev.relatedTarget.classList.contains('icon--delete')
      ) {
        return;
      }

      const newText = ev.target.value.trim();
      props.onEdit(newText);
    },
    [props.setFocus, props.onEdit]
  );

  // Handle `<textarea>` event
  // Only update local state whilst editing
  const onChange = useCallback(
    (ev) => {
      const newText = ev.target.value;
      setText(newText);
    },
    [setText]
  );

  // Trigger blur event if [Enter, ESC] key is pressed
  const onKeyDown = useCallback((ev) => {
    if ([13, 27].includes(ev.keyCode)) {
      ev.target.blur();
    }
  }, []);

  return (
    <div className="memo">
      <label className="vh" htmlFor={`${props.id}-text`}>
        Memo
      </label>
      <textarea
        ref={ref}
        value={text}
        disabled={props.isDisabled}
        id={`${props.id}-text`}
        className="memo__text"
        autoComplete="off"
        rows="1"
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default React.memo(Memo);
