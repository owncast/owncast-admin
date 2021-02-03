import { Switch, Button, Collapse, Alert } from 'antd';
import classNames from 'classnames';
import React, { useContext, useState, useEffect } from 'react';
import { UpdateArgs } from '../../../types/config-section';
import { ServerStatusContext } from '../../../utils/server-status-context';
import {
  postConfigUpdateToAPI,
  API_S3_INFO,
  RESET_TIMEOUT,
  S3_TEXT_FIELDS_INFO,
} from './constants';
import {
  createInputStatus,
  StatusState,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_SUCCESS,
} from '../../../utils/input-statuses';
import TextField from './form-textfield';
import FormStatusIndicator from './form-status-indicator';
import { isValidUrl } from '../../../utils/urls';

const { Panel } = Collapse;

// we could probably add more detailed checks here
// `currentValues` is what's currently in the global store and in the db
function checkSaveable(formValues: any, currentValues: any) {
  const { endpoint, accessKey, secret, bucket, region, enabled, servingEndpoint, acl } = formValues;
  // if fields are filled out and different from what's in store, then return true
  if (!enabled || enabled !== currentValues.enabled) {
    return true;
  }
  if (enabled) {
    if (!!endpoint && isValidUrl(endpoint) && !!accessKey && !!secret && !!bucket && !!region) {
      if (
        endpoint !== currentValues.endpoint ||
        accessKey !== currentValues.accessKey ||
        secret !== currentValues.secret ||
        region !== currentValues.region ||
        (!!currentValues.servingEndpoint && servingEndpoint !== currentValues.servingEndpoint) ||
        (!!currentValues.acl && acl !== currentValues.acl)
      ) {
        return true;
      }
    }
  } else if (enabled !== currentValues.enabled) {
    return true;
  }
  return false;
}

export default function EditStorage() {
  const [formDataValues, setFormDataValues] = useState(null);
  const [submitStatus, setSubmitStatus] = useState<StatusState>(null);
  const [saved, setSaved] = useState<Boolean>(false);

  const [shouldDisplayForm, setShouldDisplayForm] = useState(false);
  const serverStatusData = useContext(ServerStatusContext);
  const { serverConfig, setFieldInConfigState } = serverStatusData || {};

  const { s3 } = serverConfig;
  const {
    accessKey = '',
    acl = '',
    bucket = '',
    enabled = false,
    endpoint = '',
    region = '',
    secret = '',
    servingEndpoint = '',
  } = s3;

  useEffect(() => {
    setFormDataValues({
      accessKey,
      acl,
      bucket,
      enabled,
      endpoint,
      region,
      secret,
      servingEndpoint,
    });
    setShouldDisplayForm(enabled);
  }, [s3]);

  if (!formDataValues) {
    return null;
  }

  let resetTimer = null;
  const resetStates = () => {
    setSubmitStatus(null);
    resetTimer = null;
    clearTimeout(resetTimer);
  };

  // update individual values in state
  const handleFieldChange = ({ fieldName, value }: UpdateArgs) => {
    setFormDataValues({
      ...formDataValues,
      [fieldName]: value,
    });
  };

  // posts the whole state
  const handleSave = async () => {
    setSubmitStatus(createInputStatus(STATUS_PROCESSING));
    const postValue = formDataValues;

    await postConfigUpdateToAPI({
      apiPath: API_S3_INFO,
      data: { value: postValue },
      onSuccess: () => {
        setFieldInConfigState({ fieldName: 's3', value: postValue, path: '' });
        setSubmitStatus(createInputStatus(STATUS_SUCCESS, 'Updated.'));
        resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
        setSaved(true);
      },
      onError: (message: string) => {
        setSubmitStatus(createInputStatus(STATUS_ERROR, message));
        resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
      },
    });
  };

  // toggle switch.
  const handleSwitchChange = (storageEnabled: boolean) => {
    setShouldDisplayForm(storageEnabled);
    handleFieldChange({ fieldName: 'enabled', value: storageEnabled });

    // if current data in current store says s3 is enabled,
    // we should save this state
    // if (!storageEnabled && s3.enabled) {
    //   handleSave();
    // }
  };

  const containerClass = classNames({
    'edit-storage-container': true,
    enabled: shouldDisplayForm,
  });

  const saveWarning = saved ? (<Alert
    showIcon
    message="Storage changes"
    description="Your storage settings will take effect on your next stream.  If you're currently streaming you'll continue to use the storage configuration previously set."
    type="warning"
  />
  ) : null;

  const isSaveable = checkSaveable(formDataValues, s3);

  return (
    <div className={containerClass}>
      <div className="enable-switch">
        <Switch
          checked={formDataValues.enabled}
          defaultChecked={formDataValues.enabled}
          onChange={handleSwitchChange}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />{' '}
        Enabled
      </div>

      <div className="form-fields">
        <div className="field-container">
          <TextField
            {...S3_TEXT_FIELDS_INFO.endpoint}
            value={formDataValues.endpoint}
            onChange={handleFieldChange}
          />
        </div>
        <div className="field-container">
          <TextField
            {...S3_TEXT_FIELDS_INFO.accessKey}
            value={formDataValues.accessKey}
            onChange={handleFieldChange}
          />
        </div>
        <div className="field-container">
          <TextField
            {...S3_TEXT_FIELDS_INFO.secret}
            value={formDataValues.secret}
            onChange={handleFieldChange}
          />
        </div>
        <div className="field-container">
          <TextField
            {...S3_TEXT_FIELDS_INFO.bucket}
            value={formDataValues.bucket}
            onChange={handleFieldChange}
          />
        </div>
        <div className="field-container">
          <TextField
            {...S3_TEXT_FIELDS_INFO.region}
            value={formDataValues.region}
            onChange={handleFieldChange}
          />
        </div>

        <Collapse className="advanced-section">
          <Panel header="Optional Settings" key="1">
            <div className="field-container">
              <TextField
                {...S3_TEXT_FIELDS_INFO.acl}
                value={formDataValues.acl}
                onChange={handleFieldChange}
              />
            </div>
            <div className="field-container">
              <TextField
                {...S3_TEXT_FIELDS_INFO.servingEndpoint}
                value={formDataValues.servingEndpoint}
                onChange={handleFieldChange}
              />
            </div>
          </Panel>
        </Collapse>
      </div>

      {saveWarning}

      <div className="button-container">
        <Button type="primary" onClick={handleSave} disabled={!isSaveable}>
          Save
        </Button>
        <FormStatusIndicator status={submitStatus} />
      </div>
    </div>
  );
}