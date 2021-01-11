import { useState, useEffect, useContext } from 'react';
import { Table, Row } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { UserOutlined} from '@ant-design/icons';
import { SortOrder } from 'antd/lib/table/interface';
import Chart from './components/chart';
import StatisticItem from './components/statistic';

import { ServerStatusContext } from '../utils/server-status-context';

import {
  CONNECTED_CLIENTS,
  VIEWERS_OVER_TIME,
  fetchData,
} from '../utils/apis';

const FETCH_INTERVAL = 60 * 1000; // 1 min

export default function ViewersOverTime() {
  const context = useContext(ServerStatusContext);
  const {
    online,
    viewerCount,
    overallPeakViewerCount,
    sessionPeakViewerCount,
  } = context || {};

  const [viewerInfo, setViewerInfo] = useState([]);
  const [clients, setClients] = useState([]);

  const getInfo = async () => {
    try {
      const result = await fetchData(VIEWERS_OVER_TIME);
      setViewerInfo(result);
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
    if (online) {
      getStatusIntervalId = setInterval(getInfo, FETCH_INTERVAL);
      // returned function will be called on component unmount
      return () => {
        clearInterval(getStatusIntervalId);
      };
    }

    return () => [];
  }, [online]);

  // todo - check to see if broadcast active has changed. if so, start polling.

  if (!viewerInfo.length) {
    return 'no info';
  }

  const columns = [
    {
      title: 'User name',
      dataIndex: 'username',
      key: 'username',
      render: (username) => username || '-',
      sorter: (a, b) => a.username - b.username,
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
      render: (time) => formatDistanceToNow(new Date(time)),
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
      render: (geo) => geo ? `${geo.regionName}, ${geo.countryCode}` : '-',
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} justify="space-around">
        <StatisticItem
          title="Current viewers"
          value={viewerCount.toString()}
          prefix={<UserOutlined />}
        />
        <StatisticItem
          title="Peak viewers this session"
          value={sessionPeakViewerCount.toString()}
          prefix={<UserOutlined />}
        />
        <StatisticItem
          title="Peak viewers overall"
          value={overallPeakViewerCount.toString()}
          prefix={<UserOutlined />}
        />
      </Row>
      <Chart title="Viewers" data={viewerInfo} color="#2087E2" unit="" />
      <Table dataSource={clients} columns={columns} rowKey={(row) => row.clientID} />
    </div>
  );
}
