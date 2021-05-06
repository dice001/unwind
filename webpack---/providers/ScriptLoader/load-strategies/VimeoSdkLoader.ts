import { WindowWithRequire, isRequireSupported } from './requireUtils';

export type VimeoSdk = {
  Player: any;
};

interface WindowWithVimeoSdk extends WindowWithRequire {
  Vimeo: VimeoSdk;
}

declare let window: WindowWithVimeoSdk;

const VIMEO_URL = 'https://player.vimeo.com/api/player.js';

const loadWithRequire = (): Promise<VimeoSdk> =>
  new Promise((resolve, reject) =>
    window.require(
      [VIMEO_URL],
      (sdk: any) => {
        window.Vimeo = { Player: sdk };
        resolve(getSdk());
      },
      reject,
    ),
  );

const loadWithScript = (): Promise<VimeoSdk> =>
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
  return window.Vimeo;
}

function createScript() {
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = VIMEO_URL;
  return script;
}
