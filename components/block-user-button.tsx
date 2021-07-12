import { Modal, Button } from 'antd';
import { ExclamationCircleFilled, QuestionCircleFilled, StopTwoTone } from '@ant-design/icons';
import { USER_ENABLED_TOGGLE, fetchData } from '../utils/apis';
import { User } from '../types/chat';

interface BlockUserButtonProps {
  user: User;
  enabled: Boolean;
}
export default function BlockUserButton({ user, enabled }: BlockUserButtonProps) {
  async function buttonClicked({ id }) {
    const data = {
      userId: id,
      enabled,
    };

    try {
      await fetchData(USER_ENABLED_TOGGLE, {
        data,
        method: 'POST',
        auth: true,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  const actionString = enabled ? 'unblock' : 'block';
  const icon = enabled ? (
    <QuestionCircleFilled style={{ color: 'var(--ant-warning)' }} />
  ) : (
    <ExclamationCircleFilled style={{ color: 'var(--ant-error)' }} />
  );
  const messageActionString = enabled ? 'restore' : 'remove';

  const content = (
    <>
      Are you sure you want to {actionString} <strong>{user.displayName}</strong> and{' '}
      {messageActionString} their messages?
    </>
  );

  const confirmBlockAction = () => {
    Modal.confirm({
      title: `Confirm ${actionString}`,
      content,
      onCancel: () => {},
      onOk: () => buttonClicked(user),
      okType: 'danger',
      okText: enabled ? null : 'Absolutely',
      icon,
    });
  };

  return (
    <Button
      onClick={confirmBlockAction}
      size="small"
      icon={enabled ? null : <StopTwoTone twoToneColor="#ff4d4f" />}
    >
      {actionString}
    </Button>
  );
}
