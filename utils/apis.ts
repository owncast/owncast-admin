/* eslint-disable prefer-destructuring */
const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const ADMIN_STREAMKEY = process.env.NEXT_PUBLIC_ADMIN_STREAMKEY;
const NEXT_PUBLIC_API_HOST = process.env.NEXT_PUBLIC_API_HOST;

const API_LOCATION = `${NEXT_PUBLIC_API_HOST}api/admin/`;

export const FETCH_INTERVAL = 15000;

// Current inbound broadcaster info
export const STATUS = `${API_LOCATION}status`;

// Disconnect inbound stream
export const DISCONNECT = `${API_LOCATION}disconnect`;

// Change the current streaming key in memory
export const STREAMKEY_CHANGE = `${API_LOCATION}changekey`;

// Current server config
export const SERVER_CONFIG = `${API_LOCATION}serverconfig`;

// Get viewer count over time
export const VIEWERS_OVER_TIME = `${API_LOCATION}viewersOverTime`;

// Get currently connected clients
export const CONNECTED_CLIENTS = `${API_LOCATION}clients`;

// Get hardware stats
export const HARDWARE_STATS = `${API_LOCATION}hardwarestats`;

// Get all logs
export const LOGS_ALL = `${API_LOCATION}logs`;

// Get warnings + errors
export const LOGS_WARN = `${API_LOCATION}logs/warnings`;

// Get chat history
export const CHAT_HISTORY = `${API_LOCATION}chat/messages`;

// Get chat history
export const UPDATE_CHAT_MESSGAE_VIZ = `${NEXT_PUBLIC_API_HOST}api/admin/chat/updatemessagevisibility`;


const GITHUB_RELEASE_URL = 'https://api.github.com/repos/owncast/owncast/releases/latest';

interface FetchOptions {
  data?: any;
  method?: string;
  auth?: boolean;
};

export async function fetchData(url: string, options?: FetchOptions) {
  const {
    data,
    method = 'GET',
    auth = true,
  } = options || {};

  const requestOptions: RequestInit = {
    method,
  };

  if (data) {
    requestOptions.body = JSON.stringify(data)
  }

  if (auth && ADMIN_USERNAME && ADMIN_STREAMKEY) {
    const encoded = btoa(`${ADMIN_USERNAME}:${ADMIN_STREAMKEY}`);
    requestOptions.headers = {
      'Authorization': `Basic ${encoded}`
    }
    requestOptions.mode = 'cors';
    requestOptions.credentials = 'include';
  }

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error)
  }
  return {};
}

export async function getGithubRelease() {
  try {
    const response = await fetch(GITHUB_RELEASE_URL);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
  return {};
}

// Make a request to the server status API and the Github releases API
// and return a release if it's newer than the server version.
export async function upgradeVersionAvailable(currentVersion) {
  const recentRelease = await getGithubRelease();
  let recentReleaseVersion = recentRelease.tag_name;

  if (recentReleaseVersion.substr(0, 1) === 'v') {
    recentReleaseVersion = recentReleaseVersion.substr(1)
  }

  if (!upToDate(currentVersion, recentReleaseVersion)) {
    return recentReleaseVersion
  }

  return null;
}

// Stolen from https://gist.github.com/prenagha/98bbb03e27163bc2f5e4
const VPAT = /^\d+(\.\d+){0,2}$/;
function upToDate(local, remote) {
    if (!local || !remote || local.length === 0 || remote.length === 0)
        return false;
    if (local === remote)
        return true;
    if (VPAT.test(local) && VPAT.test(remote)) {
        const lparts = local.split('.');
        while(lparts.length < 3)
            lparts.push('0');
        const rparts = remote.split('.');
        while (rparts.length < 3)
            rparts.push('0');
        // eslint-disable-next-line no-plusplus
        for (let i=0; i<3; i++) {
            const l = parseInt(lparts[i], 10);
            const r = parseInt(rparts[i], 10);
            if (l === r)
                // eslint-disable-next-line no-continue
                continue;
            return l > r;
        }
        return true;
    }
        return local >= remote;

}
