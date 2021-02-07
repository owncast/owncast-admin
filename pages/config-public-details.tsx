import React from 'react';
import { Typography } from 'antd';

import EditInstanceDetails from '../components/config/edit-instance-details';
import EditDirectoryDetails from '../components/config/edit-directory';
import EditInstanceTags from '../components/config/edit-tags';
import EditSocialLinks from '../components/config/edit-social-links';
import EditPageContent from '../components/config/edit-page-content';

const { Title } = Typography;

export default function PublicFacingDetails() {
  return (
    <div className="config-public-details-page">
      <Title level={2} className="page-title">
        General Settings
      </Title>
      <p className="description">
        The following are displayed on your site to describe your stream and its content.{' '}
        <a href="https://owncast.online/docs/website/">Learn more.</a>
      </p>

      <div className="top-container">
        <div className="form-module instance-details-container">
          <EditInstanceDetails />
        </div>

        <div className="form-module social-items-container ">
          <div className="form-module tags-module">
            <EditInstanceTags />
          </div>

          <div className="form-module social-handles-container">
            <EditSocialLinks />
          </div>
        </div>

      </div>
      
      <div className="form-module page-content-module">
        <EditPageContent />
      </div>
    </div>
  );
}
