import { GoogleMapsSdk } from '../../googleMaps/types';

export interface WindowWithGoogleMapsSdk extends Window {
  initMap: Function;
  GM: GoogleMapsSdk;
  google: any;
}

declare let window: WindowWithGoogleMapsSdk;

type GoogleMapsScriptParams = {
  language: string;
  apiKey: string;
};

export const loadEndedCallbackFuncName = 'initMap';

export const loadScript = (scriptParams: GoogleMapsScriptParams) =>
  doesSdkExist()
    ? Promise.resolve(getSdk() as any)
    : (new Promise(resolve => {
        // this function is called by google maps external script once loaded
        window[loadEndedCallbackFuncName] = () => {
          window.GM = window.GM || {};
          if (!window.GM.autocomplete) {
            window.GM.autocomplete = new window.google.maps.places.AutocompleteService();
          }
          if (!window.GM.geocode) {
            window.GM.geocode = new window.google.maps.Geocoder();
          }

          resolve(getSdk());
        };

        const script: HTMLScriptElement = createScript(scriptParams);

        window.document.body.insertBefore(
          script,
          window.document.body.firstChild,
        );
      }) as Promise<any>);

function doesSdkExist() {
  return Boolean(getSdk());
}

function getSdk() {
  return window.GM;
}

function createScript(scriptParams: GoogleMapsScriptParams) {
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${scriptParams.apiKey}&callback=${loadEndedCallbackFuncName}&language=${scriptParams.language}`;
  return script;
}
