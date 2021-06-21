import { Popover, Button } from 'antd';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import format from 'date-fns/format';

import { ReactNode } from 'react-markdown';
import { User } from '../types/chat';

interface UserProps {
  user: User;
  children: ReactNode;
}

export default function UserPopover({ user, children }: UserProps) {
  const { displayName, createdAt, usernameHistory } = user;
  const lastNameChange = usernameHistory[0];
  const lastNameChangeDate = new Date(lastNameChange.changedAt);
  const dateObject = new Date(createdAt);
  const dateString = format(dateObject, 'PP pp');
  const previousNames = usernameHistory.map(entry => entry.displayName);
  const previousNamesContent =
    previousNames.length > 1 ? <div>Also known as {previousNames}</div> : null;
  const lastNameChangeDuration = formatDistanceToNow(lastNameChangeDate);

  const popoverContent = (
    <div>
      <div>Created {dateString}.</div>
      <div>Last changed name {lastNameChangeDuration} ago.</div>
      {previousNamesContent}
      <div>
        <Button>Block</Button>
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
