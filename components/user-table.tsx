import { Table } from 'antd';
import format from 'date-fns/format';
import { User } from '../types/chat';
import UserPopover from './user-popover';
import BanUserButton from './ban-user-button';

export function formatDisplayDate(date: string | Date) {
  return format(new Date(date), 'MMM d H:mma');
}
export default function UserTable({ data }: UserTableProps) {
  const columns = [
    {
      title: 'Last Known Display Name',
      dataIndex: 'displayName',
      key: 'displayName',
      // eslint-disable-next-line react/destructuring-assignment
      render: (displayName: string, user: User) => (
        <UserPopover user={user}>
          <span className="display-name">{displayName}</span>
        </UserPopover>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => formatDisplayDate(date),
    },
    {
      title: 'Disabled at',
      dataIndex: 'disabledAt',
      key: 'disabledAt',
      render: (date: Date) => (date ? formatDisplayDate(date) : null),
    },
    {
      title: '',
      key: 'block',
      className: 'actions-col',
      render: (_, user) => <BanUserButton user={user} isEnabled={!user.disabledAt} />,
    },
  ];

  return (
    <Table
      pagination={{ hideOnSinglePage: true }}
      className="table-container"
      columns={columns}
      dataSource={data}
      size="small"
      rowKey="id"
    />
  );
}

interface UserTableProps {
  data: User[];
}
