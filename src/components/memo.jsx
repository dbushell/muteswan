import React, {useCallback, useEffect, useRef, useState} from 'react';

const Memo = (props) => {
  const {text: initialText, isFocus, setFocus, onEdit} = props;

  const [text, setText] = useState(initialText || '');
  const ref = useRef();

  // Reset internal state to Redux state when out of focus
  if (!isFocus && text !== initialText) {
    setText(initialText);
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
  useEffect(onHeight, [text, onHeight]);

  useEffect(() => {
    // Focus `<textarea>` when adding new item
    if (isFocus !== true && text === '') {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  // Handle `<textarea>` event
  const onFocus = useCallback(() => {
    setFocus(true);
  }, [setFocus]);

  // Handle `<textarea>` event
  // Trim whitespace and newlines
  // Use callback to update Redux state unless delete button was clicked
  const onBlur = useCallback(
    (ev) => {
      setFocus(false);
      if (
        ev.relatedTarget &&
        ev.relatedTarget.classList.contains('icon--delete')
      ) {
        return;
      }

      const newText = ev.target.value.trim();
      onEdit(newText);
    },
    [setFocus, onEdit]
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
