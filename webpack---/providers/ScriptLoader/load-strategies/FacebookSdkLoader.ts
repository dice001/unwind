// DefinitelyTyped package for facebook-js-sdk augments window object
// Installing this library will allow all files to access window.FB
export type FacebookSdk = {
  XFBML: {
    parse: (node?: HTMLElement) => void;
  };
};

interface WindowWithFacebookSdk extends Window {
  fbAsyncInit: () => void;
  FB?: FacebookSdk;
}

declare let window: WindowWithFacebookSdk;

export const loadScript = (scriptParams: FacebookScriptParams) =>
  doesSdkExist()
    ? Promise.resolve(getSdk() as FacebookSdk)
    : (new Promise(resolve => {
        window.fbAsyncInit = () => {
          resolve(getSdk());
        };

        const domFragment = window.document.createDocumentFragment();
        domFragment.appendChild(createFacebookRootElement());
        domFragment.appendChild(createFacebookScriptElement(scriptParams));

        window.document.body.insertBefore(
          domFragment,
          window.document.body.firstChild,
        );
      }) as Promise<FacebookSdk>);

function doesSdkExist() {
  return Boolean(getSdk());
}

function getSdk() {
  return window.FB;
}

function createFacebookScriptElement({
  language,
  appId,
  version,
}: FacebookScriptParams) {
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `//connect.facebook.net/${language}/sdk.js#xfbml=1&appId=${appId}&version=${version}`;
  return script;
}

function createFacebookRootElement() {
  const fbRootDiv = document.createElement('div');
  fbRootDiv.id = 'fb-root';
  fbRootDiv.style.display = 'none';
  return fbRootDiv;
}

type FacebookScriptParams = {
  language: string;
  appId: string;
  version: string;
};
