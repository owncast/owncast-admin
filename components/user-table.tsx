import { Table } from 'antd';
import format from 'date-fns/format';
import { User } from '../types/chat';
import UserPopover from './user-popover';
import BlockUserButton from './block-user-button';

export default function UserTable({ data }: UserTableProps) {
  const columns = [
    {
      title: 'Display Name',
      dataIndex: 'displayName',
      key: 'displayName',
      // eslint-disable-next-line react/destructuring-assignment
      render: (_, user) => <UserPopover user={user}>{user.displayName}</UserPopover>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => format(new Date(date), 'MMM d H:mma'),
    },
    {
      title: 'Disabled',
      dataIndex: 'disabledAt',
      key: 'disabledAt',
      render: date => (date ? format(new Date(date), 'MMM d H:mma') : null),
    },
    {
      title: '',
      key: 'block',
      render: (_, user) => <BlockUserButton user={user} enabled={!!user.disabledAt} />,
    },
  ];

  return (
    <>
      <Table
        pagination={{ hideOnSinglePage: true }}
        columns={columns}
        dataSource={data}
        rowKey="id"
      />
    </>
  );
}

interface UserTableProps {
  data: User[];
}
