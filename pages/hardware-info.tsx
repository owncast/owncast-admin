import { BulbOutlined, LaptopOutlined, SaveOutlined } from '@ant-design/icons';
import { Row, Col, Typography } from 'antd';
import React, { useEffect, useContext } from 'react';
import { fetchData, FETCH_INTERVAL, HARDWARE_STATS } from '../utils/apis';
import Chart from '../components/chart';
import StatisticItem from '../components/statistic';
import { StreamLifecycleContext } from '../utils/stream-lifecycle-context';

// TODO: FIX TS WARNING FROM THIS.
// interface TimedValue {
//   time: Date;
//   value: Number;
// }

export default function HardwareInfo() {
  const streamLifecycle = useContext(StreamLifecycleContext);
  const { hardwareStatus } = streamLifecycle || {};

  // const [hardwareStatus, setHardwareStatus] = useState({
  //   cpu: [], // Array<TimedValue>(),
  //   memory: [], // Array<TimedValue>(),
  //   disk: [], // Array<TimedValue>(),
  //   message: '',
  // });

  if (!hardwareStatus.cpu) {
    return null;
  }

  const currentCPUUsage = hardwareStatus.cpu[hardwareStatus.cpu.length - 1]?.value;
  const currentRamUsage = hardwareStatus.memory[hardwareStatus.memory.length - 1]?.value;
  const currentDiskUsage = hardwareStatus.disk[hardwareStatus.disk.length - 1]?.value;

  const series = [
    {
      name: 'CPU',
      color: '#B63FFF',
      data: hardwareStatus.cpu,
    },
    {
      name: 'Memory',
      color: '#2087E2',
      data: hardwareStatus.memory,
    },
    {
      name: 'Disk',
      color: '#FF7700',
      data: hardwareStatus.disk,
    },
  ];

  return (
    <>
      <Typography.Title>Hardware Info</Typography.Title>
      <br />
      <div>
        <Row gutter={[16, 16]} justify="space-around">
          <Col>
            <StatisticItem
              title={series[0].name}
              value={`${currentCPUUsage || 0}`}
              prefix={<LaptopOutlined style={{ color: series[0].color }} />}
              color={series[0].color}
              progress
              centered
            />
          </Col>
          <Col>
            <StatisticItem
              title={series[1].name}
              value={`${currentRamUsage || 0}`}
              prefix={<BulbOutlined style={{ color: series[1].color }} />}
              color={series[1].color}
              progress
              centered
            />
          </Col>
          <Col>
            <StatisticItem
              title={series[2].name}
              value={`${currentDiskUsage || 0}`}
              prefix={<SaveOutlined style={{ color: series[2].color }} />}
              color={series[2].color}
              progress
              centered
            />
          </Col>
        </Row>

        <Chart title="% used" dataCollections={series} color="#FF7700" unit="%" />
      </div>
    </>
  );
}
