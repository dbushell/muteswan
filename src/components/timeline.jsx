import React from 'react';

import Group from './group';
import {useFutureGroups, useHistoryGroups, usePermaGroups} from '../selectors';
import {Separator} from './svg';

const Timeline = React.memo((props) => {
  const classes = ['timeline', ...props.classes];
  return (
    <div className={classes.join(' ')}>
      {props.groups.map((group) => {
        return <Group key={group.id} {...group} />;
      })}
      <Separator />
    </div>
  );
});

export const FutureTimeline = React.memo(() => {
  const groups = useFutureGroups();
  return <Timeline groups={groups} classes={['timeline--future']} />;
});

export const HistoryTimeline = React.memo(() => {
  const groups = useHistoryGroups();
  return <Timeline groups={groups} classes={['timeline--history']} />;
});

export const PermaTimeline = React.memo(() => {
  const groups = usePermaGroups();
  return <Timeline groups={groups} classes={['timeline--perma']} />;
});
