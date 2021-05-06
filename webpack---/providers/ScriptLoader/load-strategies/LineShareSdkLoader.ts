interface WindowWithLineSdk extends Window {
  LineIt: {
    loadButton: () => void;
  };
}

declare let window: WindowWithLineSdk;

const LineSDKUrl =
  'https://d.line-scdn.net/r/web/social-plugin/js/thirdparty/loader.min.js';

const lineSDKLoaded = (): boolean => {
  return typeof getLineItSDK() !== 'undefined';
};

function createScript(): HTMLScriptElement {
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = LineSDKUrl;
  return script;
}

function getLineItSDK() {
  return window.LineIt;
}

const loadWithScript = (): Promise<typeof window.LineIt> =>
  new Promise((resolve, reject) => {
    const script: HTMLScriptElement = createScript();
    script.addEventListener('load', () => {
      resolve(getLineItSDK());
    });
    script.addEventListener('error', reject);
    window.document.body.append(script);
  });

export const loadScript = (): Promise<typeof window.LineIt> => {
  if (!lineSDKLoaded()) {
    return loadWithScript();
  } else {
    return new Promise(resolve => {
      resolve(getLineItSDK());
    });
  }
};
