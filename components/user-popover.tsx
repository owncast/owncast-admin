import { Popover, Button } from 'antd';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import format from 'date-fns/format';
import { ReactNode } from 'react-markdown';
import BlockUserbutton from './block-user-button';

import { makeAndStringFromArray } from '../utils/format';

import { User } from '../types/chat';

interface UserProps {
  user: User;
  children: ReactNode;
}

export default function UserPopover({ user, children }: UserProps) {
  const { displayName, createdAt, usernameHistory } = user;
  let lastNameChange = null;
  let lastNameChangeDate = null;
  if (usernameHistory && usernameHistory.length > 0) {
    lastNameChange = usernameHistory[0];
    lastNameChangeDate = new Date(lastNameChange.changedAt);
  }

  const dateObject = new Date(createdAt);
  const dateString = format(dateObject, 'PP pp');
  const previousNames = usernameHistory ? usernameHistory.map(entry => entry.displayName) : [];
  const previousNamesContent =
    previousNames.length > 1 ? (
      <div>Also known as {makeAndStringFromArray(previousNames.slice(1))}.</div>
    ) : null;
  const lastNameChangeDuration = lastNameChangeDate
    ? formatDistanceToNow(lastNameChangeDate)
    : null;

  const lastNameChangeTimestamp = lastNameChangeDate ? (
    <div>Last changed name {lastNameChangeDuration} ago.</div>
  ) : null;
  const popoverContent = (
    <div>
      <div>Created {dateString}.</div>
      {lastNameChangeTimestamp}
      {previousNamesContent}
      <div>
        <BlockUserbutton user={user} enabled={!!user.disabledAt} />
      </div>
    </div>
  );

  return (
    <span>
      <Popover content={popoverContent} title={displayName}>
        {children}
      </Popover>
    </span>
  );
}
