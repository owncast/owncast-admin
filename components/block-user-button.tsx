import { Modal, Button } from 'antd';
import { ExclamationCircleFilled, QuestionCircleFilled, StopTwoTone } from '@ant-design/icons';
import { USER_ENABLED_TOGGLE, fetchData } from '../utils/apis';
import { User } from '../types/chat';

interface BlockUserButtonProps {
  user: User;
  isEnabled: Boolean; // = this user's current status
  label?: string;
  onClick?: () => void;
}
export default function BlockUserButton({ user, isEnabled, label, onClick }: BlockUserButtonProps) {
  async function buttonClicked({ id }) {
    const data = {
      userId: id,
      enabled: !isEnabled, // set user to this value
    };

    try {
      await fetchData(USER_ENABLED_TOGGLE, {
        data,
        method: 'POST',
        auth: true,
      });
      onClick?.();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  const actionString = isEnabled ? 'ban' : 'unban';
  const icon = isEnabled ? (
    <ExclamationCircleFilled style={{ color: 'var(--ant-error)' }} />
  ) : (
    <QuestionCircleFilled style={{ color: 'var(--ant-warning)' }} />
  );
  const messageActionString = isEnabled ? 'remove' : 'restore';

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
      okText: isEnabled ? 'Absolutely' : null,
      icon,
    });
  };

  return (
    <Button
      onClick={confirmBlockAction}
      size="small"
      icon={isEnabled ? <StopTwoTone twoToneColor="#ff4d4f" /> : null}
      className="block-user-button"
    >
      {label || actionString}
    </Button>
  );
}
BlockUserButton.defaultProps = {
  label: '',
  onClick: null,
};
