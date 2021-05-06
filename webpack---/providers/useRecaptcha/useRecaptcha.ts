/// <reference types="grecaptcha" />
import { useRef } from 'react';
import { getScriptOrLoad } from '../ScriptLoader/ScriptLoader';
import { SITE_KEY } from './constants';

export type RecaptchaProps = {
  language?: string;
  theme?: ReCaptchaV2.Parameters['theme'];
  size?: ReCaptchaV2.Parameters['size'];
  tabindex?: number;
  verifiedCallback?: (token: string) => void;
  expiredCallback?: () => void;
  errorCallback?: () => void;
  loadedCallback?: () => void;
};

export type RecaptchaReturnType = [
  (elem: HTMLElement | null) => Promise<void>,
  {
    reset: () => Promise<void>;
  },
];

export const useRecaptcha = ({
  language,
  theme,
  size,
  tabindex,
  verifiedCallback,
  expiredCallback,
  errorCallback,
  loadedCallback,
}: RecaptchaProps): RecaptchaReturnType => {
  const cacheResultRef = useRef<RecaptchaReturnType>();

  const widgetIdRef = useRef<number | undefined>(undefined);

  if (cacheResultRef.current) {
    return cacheResultRef.current;
  }

  const ref = async (elem: HTMLElement | null) => {
    if (!elem || widgetIdRef.current) {
      return;
    }
    const sdk = await getScriptOrLoad('recaptcha', {
      hl: language,
    });
    widgetIdRef.current = sdk.render(elem, {
      sitekey: SITE_KEY,
      theme,
      size,
      tabindex,
      callback: verifiedCallback,
      'expired-callback': expiredCallback,
      'error-callback': errorCallback,
    });
    if (loadedCallback) {
      loadedCallback();
    }
  };

  const reset = async () => {
    if (typeof widgetIdRef.current !== 'number') {
      return;
    }
    const sdk = await getScriptOrLoad('recaptcha', {
      hl: language,
    });
    if (sdk && sdk.render) {
      sdk.reset(widgetIdRef.current);
    }
  };

  return (cacheResultRef.current = [
    ref,
    {
      reset,
    },
  ]);
};
