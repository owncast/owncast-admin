import { Button, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useState, useContext } from 'react';
import FormStatusIndicator from './form-status-indicator';
import { ServerStatusContext } from '../../utils/server-status-context';
import {
  postConfigUpdateToAPI,
  RESET_TIMEOUT,
} from '../../utils/config-constants';
import {
  createInputStatus,
  StatusState,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_SUCCESS,
} from '../../utils/input-statuses';
import { NEXT_PUBLIC_API_HOST } from '../../utils/apis';

const ACCEPTED_FILE_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];

function getBase64(img: File | Blob, callback: (imageUrl: string | ArrayBuffer) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface ImageFieldWithSubmitProps {
  apiPath: string;
  fieldName: string;
  tip: string;
  label: string;
}

export default function ImageField(props: ImageFieldWithSubmitProps) {
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageCachebuster, setImageCachebuster] = useState(0);

  const serverStatusData = useContext(ServerStatusContext);
  const { setFieldInConfigState, serverConfig } = serverStatusData || {};
  const currentImage = serverConfig?.instanceDetails?.[props.fieldName];

  const [submitStatus, setSubmitStatus] = useState<StatusState>(null);
  let resetTimer = null;

  // Clear out any validation states and messaging
  const resetStates = () => {
    setSubmitStatus(null);
    clearTimeout(resetTimer);
    resetTimer = null;
  };

  // validate file type and create base64 encoded img
  const beforeUpload = (file: RcFile) => {
    setLoading(true);

    // eslint-disable-next-line consistent-return
    return new Promise<void>((res, rej) => {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        const msg = `File type is not supported: ${file.type}`;
        setSubmitStatus(createInputStatus(STATUS_ERROR, `There was an error: ${msg}`));
        resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
        setLoading(false);
        return rej();
      }

      getBase64(file, (url: string) => {
        setImageURL(url);
        return res();
      });
    });
  };

  // Post new image to api
  const handleImageUpdate = async () => {
    if (imageURL !== currentImage) {
      setSubmitStatus(createInputStatus(STATUS_PROCESSING));

      await postConfigUpdateToAPI({
        apiPath: props.apiPath,
        data: { value: imageURL },
        onSuccess: () => {
          setFieldInConfigState({ fieldName: props.fieldName, value: imageURL, path: '' });
          setSubmitStatus(createInputStatus(STATUS_SUCCESS));
          setLoading(false);
          setImageCachebuster(Math.floor(Math.random() * 100)); // Force image to re-load
        },
        onError: (msg: string) => {
          setSubmitStatus(createInputStatus(STATUS_ERROR, `There was an error: ${msg}`));
          setLoading(false);
        },
      });
      resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
    }
  };

  const imageDisplayUrl = NEXT_PUBLIC_API_HOST + props.fieldName + '?random=' + imageCachebuster;

  return (
    <div className="formfield-container logo-upload-container">
      <div className="label-side">
        <span className="formfield-label">{props.label}</span>
      </div>

      <div className="input-side">
        <div className="input-group">
          <img src={imageDisplayUrl} alt="avatar" className="logo-preview" />
          <Upload
            name={props.fieldName}
            listType="picture"
            className="avatar-uploader"
            showUploadList={false}
            accept={ACCEPTED_FILE_TYPES.join(',')}
            beforeUpload={beforeUpload}
            customRequest={handleImageUpdate}
            disabled={loading}
          >
            {loading ? (
              <LoadingOutlined style={{ color: 'white' }} />
            ) : (
              <Button icon={<UploadOutlined />} />
            )}
          </Upload>
        </div>
        <FormStatusIndicator status={submitStatus} />
        <p className="field-tip">{props.tip}</p>
      </div>
    </div>
  );
}
