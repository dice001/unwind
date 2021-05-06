/// <reference types="grecaptcha" />

export type RecaptchaScriptParams = {
  hl?: string;
};

declare let window: Window & {
  grecaptcha_onload: () => void;
  grecaptcha: ReCaptchaV2.ReCaptcha;
};

export const loadScript = (
  scriptParams: RecaptchaScriptParams,
): Promise<ReCaptchaV2.ReCaptcha> =>
  doesSdkExist()
    ? Promise.resolve(getSdk())
    : new Promise(resolve => {
        window.grecaptcha_onload = () => {
          resolve(getSdk());
        };
        window.document.body.append(createRecaptchaScriptElement(scriptParams));
      });

function doesSdkExist() {
  return Boolean(getSdk());
}

function getSdk() {
  return window.grecaptcha;
}

function createRecaptchaScriptElement(scriptParams: RecaptchaScriptParams) {
  const { hl } = scriptParams;
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  const url = new URL('https://www.google.com/recaptcha/api.js');
  if (hl) {
    url.searchParams.append('hl', hl);
  }
  url.searchParams.append('onload', 'grecaptcha_onload');
  url.searchParams.append('render', 'explicit');
  script.src = url.toString();
  return script;
}
