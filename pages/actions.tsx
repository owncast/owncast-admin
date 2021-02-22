import React, { useState, useEffect, useContext } from 'react';
import { Table, Tag, Space, Button, Modal, Checkbox, Input, Typography, Tooltip } from 'antd';
import { ServerStatusContext } from '../utils/server-status-context';
import { DeleteOutlined } from '@ant-design/icons';
import isValidUrl from '../utils/urls';

import { fetchData, CREATE_WEBHOOK, EXTERNAL_ACTIONS } from '../utils/apis';

const { Title, Paragraph } = Typography;

interface Props {
  onCancel: () => void;
  onOk: any; // todo: make better type
  visible: boolean;
}

function NewActionModal(props: Props) {
  const serverStatusData = useContext(ServerStatusContext);
  const { serverConfig, setFieldInConfigState } = serverStatusData || {};

  const { onOk, onCancel, visible } = props;

  const [actionUrl, setActionUrl] = useState('');
  const [actionTitle, setActionTitle] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [openExternally, setOpenExternally] = useState(false);

  function save() {
    onOk(actionUrl, actionTitle, actionDescription, openExternally);
  }

  const okButtonProps = {
    disabled: !isValidUrl(actionUrl) || actionTitle === '',
  };

  const onOpenExternallyChanged = checkbox => {
    setOpenExternally(checkbox.target.checked);
  };

  return (
    <Modal
      title="Create New Action"
      visible={visible}
      onOk={save}
      onCancel={onCancel}
      okButtonProps={okButtonProps}
    >
      <div>
        <p>
          <Input
            value={actionUrl}
            placeholder="https://myserver.com/action (required)"
            onChange={input => setActionUrl(input.currentTarget.value)}
          />
        </p>
        <p>
          <Input
            value={actionTitle}
            placeholder="Your action title (required)"
            onChange={input => setActionTitle(input.currentTarget.value)}
          />
        </p>

        <p>
          <Input
            value={actionDescription}
            placeholder="Optional description"
            onChange={input => setActionDescription(input.currentTarget.value)}
          />
        </p>
        <Checkbox
          checked={openExternally}
          defaultChecked={openExternally}
          onChange={onOpenExternallyChanged}
        >
          Open in a new tab instead of within your page.
        </Checkbox>
      </div>
    </Modal>
  );
}

export default function Actions() {
  const serverStatusData = useContext(ServerStatusContext);
  const { serverConfig, setFieldInConfigState } = serverStatusData || {};
  const { externalActions } = serverConfig;
  const [actions, setActions] = useState(externalActions);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      title: '',
      key: 'delete',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} />
        </Space>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Opens',
      dataIndex: 'openExternally',
      key: 'openExternally',
      render: (openExternally: boolean) => {
        return openExternally ? 'In a new tab' : 'In a modal';
      },
    },
  ];

  async function handleDelete(id) {
    try {
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave(
    url: string,
    title: string,
    description: string,
    openExternally: boolean,
  ) {
    try {
      const newAction = await fetchData(EXTERNAL_ACTIONS, {
        method: 'POST',
        data: { url, title, description, openExternally },
      });
      setActions(actions.concat({ url, title, description, openExternally }));
    } catch (error) {
      console.error(error);
    }
  }

  const showCreateModal = () => {
    setIsModalVisible(true);
  };

  const handleModalSaveButton = (
    actionUrl: string,
    actionTitle: string,
    actionDescription: string,
    openExternally: boolean,
  ) => {
    setIsModalVisible(false);
    handleSave(actionUrl, actionTitle, actionDescription, openExternally);
  };

  const handleModalCancelButton = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Title>External Actions</Title>
      <Paragraph>Description goes here.</Paragraph>
      <Paragraph>
        Read more about how to use actions, with examples, at{' '}
        <a href="https://owncast.online/thirdparty/?source=admin">our documentation</a>.
      </Paragraph>

      <Table rowKey="id" columns={columns} dataSource={actions} pagination={false} />
      <br />
      <Button type="primary" onClick={showCreateModal}>
        Create New Action
      </Button>
      <NewActionModal
        visible={isModalVisible}
        onOk={handleModalSaveButton}
        onCancel={handleModalCancelButton}
      />
    </div>
  );
}
