import { WindowWithRequire, isRequireSupported } from './requireUtils';

export type TwitchSdk = {
  PlayerEmbed: any;
};

interface WindowWithTwitchSdk extends WindowWithRequire {
  Twitch: TwitchSdk;
}

declare let window: WindowWithTwitchSdk;

const TWITCH_URL = 'https://player.twitch.tv/js/embed/v1.js';

const loadWithRequire = (): Promise<TwitchSdk> =>
  new Promise((resolve, reject) =>
    window.require(
      [TWITCH_URL],
      (sdk: any) => {
        window.Twitch = sdk;
        resolve(sdk);
      },
      reject,
    ),
  );

const loadWithScript = (): Promise<TwitchSdk> =>
  new Promise((resolve, reject) => {
    const script: HTMLScriptElement = createScript();
    script.addEventListener('load', () => resolve(getSdk()));
    script.addEventListener('error', reject);

    window.document.body.insertBefore(script, window.document.body.firstChild);
  });

export const loadScript = () => {
  if (doesSdkExist()) {
    return Promise.resolve(getSdk());
  }

  // Using require is a temporary solution. See https://github.com/wix-private/editor-elements/pull/2174 for details
  return isRequireSupported(window) ? loadWithRequire() : loadWithScript();
};

function doesSdkExist() {
  return Boolean(getSdk());
}

function getSdk() {
  return window.Twitch;
}

function createScript() {
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = TWITCH_URL;
  return script;
}
