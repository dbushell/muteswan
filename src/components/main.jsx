import React, {useCallback, useEffect} from 'react';

import {FutureTimeline, HistoryTimeline, PermaTimeline} from './timeline';
import ItemPreview from './item-preview';

const Main = () => {
  // Scroll to "today" DOM location
  const onLoad = useCallback(() => {
    window.requestAnimationFrame(() => {
      const group = window.document.querySelector('.group--today');
      if (group) {
        group.scrollIntoView({
          block: 'center',
          behavior: 'smooth'
        });
      }
    });
  }, []);

  // Trigger on first load
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <main className="main">
      <PermaTimeline />
      <FutureTimeline />
      <HistoryTimeline />
      <ItemPreview />
    </main>
  );
};

export default React.memo(Main);
