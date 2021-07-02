import React, { useState, useEffect, useContext } from 'react';
import { Table, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { SortOrder } from 'antd/lib/table/interface';

import { ServerStatusContext } from '../../utils/server-status-context';

import { CONNECTED_CLIENTS, fetchData, DISABLED_USERS } from '../../utils/apis';
import UserTable from '../../components/user-table';
import { User } from '../../types/chat';
import ClientTable from '../../components/client-table';

const FETCH_INTERVAL = 10 * 1000; // 10 sec

export default function ChatUsers() {
  const context = useContext(ServerStatusContext);
  const { online } = context || {};

  const [disabledUsers, setDisabledUsers] = useState([]);
  const [clients, setClients] = useState([]);

  const getInfo = async () => {
    try {
      const result = await fetchData(DISABLED_USERS);
      setDisabledUsers(result);
    } catch (error) {
      console.log('==== error', error);
    }

    try {
      const result = await fetchData(CONNECTED_CLIENTS);
      setClients(result);
    } catch (error) {
      console.log('==== error', error);
    }
  };

  useEffect(() => {
    let getStatusIntervalId = null;

    getInfo();

    getStatusIntervalId = setInterval(getInfo, FETCH_INTERVAL);
    // returned function will be called on component unmount
    return () => {
      clearInterval(getStatusIntervalId);
    };

  }, [online]);

  const connectedUsers = online ? (
    <p>
      <ClientTable data={clients} />
      <Typography.Text type="secondary">
        Visit the{' '}
        <a
          href="https://owncast.online/docs/viewers/?source=admin"
          target="_blank"
          rel="noopener noreferrer"
        >
          documentation
        </a>{' '}
        to configure additional details about your viewers.
      </Typography.Text>{' '}
    </p>
  ) : (
    <p>
      When a stream is active and chat is enabled, connected chat clients will be displayed here.
    </p>
  );
  return (
    <p>
      <div>
        <Typography.Title>Connected</Typography.Title>
        {connectedUsers}

        <p>
          <Typography.Title>Blocked</Typography.Title>
          <UserTable data={disabledUsers} />
        </p>
      </div>
    </p>
  );
}
