export type DMSdk = {
  player: any;
};

interface WindowWithDMSdk extends Window {
  dmAsyncInit: () => void;
  DM: any;
}

declare let window: WindowWithDMSdk;

export const loadScript = () =>
  doesSdkExist()
    ? Promise.resolve(getSdk() as DMSdk)
    : (new Promise(resolve => {
        window.dmAsyncInit = () => {
          resolve(getSdk());
        };

        const script: HTMLScriptElement = createScript();

        script.addEventListener('load', () => resolve(getSdk()));

        window.document.body.insertBefore(
          script,
          window.document.body.firstChild,
        );
      }) as Promise<DMSdk>);

function doesSdkExist() {
  return Boolean(getSdk());
}

function getSdk() {
  return window.DM;
}

function createScript() {
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = 'https://api.dmcdn.net/all.js';
  return script;
}
