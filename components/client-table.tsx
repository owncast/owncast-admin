import { Table } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { formatDistanceToNow } from 'date-fns';
import { User } from '../types/chat';
import UserPopover from './user-popover';
import BlockUserButton from './block-user-button';

export default function ClientTable({ data }: ClientTableProps) {
  const columns = [
    {
      title: 'User name',
      key: 'username',
      // eslint-disable-next-line react/destructuring-assignment
      render: client => <UserPopover user={client.user}>{client.user.displayName}</UserPopover>,
      sorter: (a, b) => a.user.displayName - b.user.displayName,
      sortDirections: ['descend', 'ascend'] as SortOrder[],
    },
    {
      title: 'Messages sent',
      dataIndex: 'messageCount',
      key: 'messageCount',
      sorter: (a, b) => a.messageCount - b.messageCount,
      sortDirections: ['descend', 'ascend'] as SortOrder[],
    },
    {
      title: 'Connected Time',
      dataIndex: 'connectedAt',
      key: 'connectedAt',
      render: time => formatDistanceToNow(new Date(time)),
      sorter: (a, b) => new Date(a.connectedAt).getTime() - new Date(b.connectedAt).getTime(),
      sortDirections: ['descend', 'ascend'] as SortOrder[],
    },
    {
      title: 'User Agent',
      dataIndex: 'userAgent',
      key: 'userAgent',
    },
    {
      title: 'Location',
      dataIndex: 'geo',
      key: 'geo',
      render: geo => (geo ? `${geo.regionName}, ${geo.countryCode}` : '-'),
    },
    {
      title: 'Block',
      key: 'block',
      render: (_, row) => <BlockUserButton user={row.user} enabled={!!row.disabledAt} />,
    },
  ];

  return (
    <Table
      pagination={{ hideOnSinglePage: true }}
      columns={columns}
      dataSource={data}
      rowKey="id"
    />
  );
}

interface Client {
  user: User;
}
interface ClientTableProps {
  data: Client[];
}
