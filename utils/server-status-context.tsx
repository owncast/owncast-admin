import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { STATUS, fetchData, FETCH_INTERVAL, SERVER_CONFIG } from './apis';

export const initialServerConfigState = {
  streamKey: '',
  yp: {
    enabled: false,
  },
  videoSettings: {
    videoQualityVariants: [
      {
        audioPassthrough: false,
        videoPassthrough: false,
        videoBitrate: 0,
        audioBitrate: 0,
        framerate: 0,
      },
    ],
  }
};

const initialServerStatusState = {
  broadcastActive: false,
  broadcaster: null,
  online: false,
  viewerCount: 0,
  sessionMaxViewerCount: 0,
  sessionPeakViewerCount: 0,
  overallPeakViewerCount: 0,
  disableUpgradeChecks: true,
  versionNumber: '0.0.0',
};

export const ServerStatusContext = createContext({
  ...initialServerStatusState,
  serverConfig: initialServerConfigState,
});

const ServerStatusProvider = ({ children }) => {
  const [status, setStatus] = useState(initialServerStatusState);
  const [config, setConfig] = useState(initialServerConfigState);

  const getStatus = async () => {
    try {
      const result = await fetchData(STATUS);
      setStatus({ ...result });

    } catch (error) {
      // todo
    }
  };
  const getConfig = async () => {
    try {
      const result = await fetchData(SERVER_CONFIG);
      setConfig(result);
    } catch (error) {
      // todo
    }
  };

  
  useEffect(() => {
    let getStatusIntervalId = null;

    getStatus();
    getStatusIntervalId = setInterval(getStatus, FETCH_INTERVAL);

    getConfig();

    // returned function will be called on component unmount 
    return () => {
      clearInterval(getStatusIntervalId);
    }
  }, [])

  const providerValue = {
      ...status,
      serverConfig: config,
  };
  return (
    <ServerStatusContext.Provider value={providerValue}>
      {children}
    </ServerStatusContext.Provider>
  );
}

ServerStatusProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ServerStatusProvider;