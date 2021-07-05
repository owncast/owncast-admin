import { Popover } from 'antd';
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
  const { displayName, createdAt, previousNames, nameChangedAt } = user;
  let lastNameChangeDate = null;
  if (previousNames && previousNames.length > 1 && nameChangedAt) {
    lastNameChangeDate = new Date(nameChangedAt);
  }

  const dateObject = new Date(createdAt);
  const dateString = format(dateObject, 'PP pp');
  const previousNamesContent =
    previousNames && previousNames.length > 1 ? (
      <div>Also known as {makeAndStringFromArray(previousNames.slice(0, -1))}.</div>
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
