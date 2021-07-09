import { Popconfirm, Button } from 'antd';
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
      await fetchData(`${USER_ENABLED_TOGGLE}`, {
        data,
        method: 'POST',
        auth: true,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  const title = enabled ? 'Unblock' : 'Block';

  return (
    <Popconfirm
      title={`Are you sure you want to ${enabled ? 'unblock' : 'block'} ${
        user.displayName
      } from chat and remove all of their messages?`}
      onConfirm={() => buttonClicked(user)}
      okText="Absolutely"
      cancelText="No"
    >
      <Button>{title}</Button>
    </Popconfirm>
  );
}
