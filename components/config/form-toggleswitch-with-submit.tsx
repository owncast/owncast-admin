// This is a wrapper for the Ant Switch component.
// onChange of the switch, it will automatically post a change to the config api.

import React, { useState, useContext } from 'react';
import { Switch } from 'antd';
import {
  createInputStatus,
  StatusState,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_SUCCESS,
} from '../../utils/input-statuses';
import FormStatusIndicator from './form-status-indicator';

import { RESET_TIMEOUT, postConfigUpdateToAPI } from '../../utils/config-constants';

import { ServerStatusContext } from '../../utils/server-status-context';

interface ToggleSwitchProps {
  apiPath: string;
  fieldName: string;

  checked?: boolean;
  configPath?: string;
  disabled?: boolean;
  label?: string;
  tip?: string;
}

export default function ToggleSwitch(props: ToggleSwitchProps) {
  const [submitStatus, setSubmitStatus] = useState<StatusState>(null);

  let resetTimer = null;

  const serverStatusData = useContext(ServerStatusContext);
  const { setFieldInConfigState } = serverStatusData || {};

  const { apiPath, checked, configPath = '', disabled = false, fieldName, label, tip } = props;

  const resetStates = () => {
    setSubmitStatus(null);
    clearTimeout(resetTimer);
    resetTimer = null;
  };

  const handleChange = async (isChecked: boolean) => {
    setSubmitStatus(createInputStatus(STATUS_PROCESSING));

    await postConfigUpdateToAPI({
      apiPath,
      data: { value: isChecked },
      onSuccess: () => {
        setFieldInConfigState({ fieldName, value: isChecked, path: configPath });
        setSubmitStatus(createInputStatus(STATUS_SUCCESS));
      },
      onError: (message: string) => {
        setSubmitStatus(createInputStatus(STATUS_ERROR, `There was an error: ${message}`));
      },
    });
    resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
  };

  const loading = submitStatus !== null && submitStatus.type === STATUS_PROCESSING;
  return (
    <div className="formfield-container toggleswitch-container">
      {label ? (
        <div className="label-side">
          <span className="formfield-label">{label}</span>
        </div>
      ) : null}

      <div className="input-side">
        <div className="input-group">
          <Switch
            className={`switch field-${fieldName}`}
            loading={loading}
            onChange={handleChange}
            defaultChecked={checked}
            checked={checked}
            checkedChildren="ON"
            unCheckedChildren="OFF"
            disabled={disabled}
          />
        </div>
        <FormStatusIndicator status={submitStatus} />
        <p className="field-tip">{tip}</p>
      </div>
    </div>
  );
}

ToggleSwitch.defaultProps = {
  checked: false,
  configPath: '',
  disabled: false,
  label: '',
  tip: '',
};
