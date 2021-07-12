import { useState } from 'react';
import { Modal, Tooltip } from 'antd';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleShowModal = () => {
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };


  const { displayName, createdAt, previousNames, nameChangedAt } = user;
  let lastNameChangeDate = null;
  if (previousNames && previousNames.length > 1 && nameChangedAt) {
    lastNameChangeDate = new Date(nameChangedAt);
  }

  const dateObject = new Date(createdAt);
  const createdAtDate = format(dateObject, 'PP pp');
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
  // const popoverContent = (
  //   <>
  //     <div>Created {createdAtDate}.</div>
  //     {lastNameChangeTimestamp}
  //     {previousNamesContent}
  //     <BlockUserbutton user={user} enabled={!!user.disabledAt} />
  //   </>
  // );

  return (
    <>
      <Tooltip title={`Created at: ${createdAtDate}`} placement="bottomLeft">
        <button type="button" className="user-item-container" onClick={handleShowModal}>
          {children}
        </button>
      </Tooltip>
      <Modal
        destroyOnClose
        cancelText="Close"
        okButtonProps={{ style: { display: 'none' } }}
        title={`${displayName} details`}
        visible={isModalVisible}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
      >
        <div>Created {createdAtDate}.</div>
        {lastNameChangeTimestamp}
        {previousNamesContent}
        <BlockUserbutton user={user} enabled={!!user.disabledAt} />
      </Modal>
    </>
  );
}
