import * as loadFacebookStrategy from './load-strategies/FacebookSdkLoader';
import * as loadVimeoStrategy from './load-strategies/VimeoSdkLoader';
import * as loadDMStrategy from './load-strategies/DailyMotionSdkLoader';
import * as loadTwitchStrategy from './load-strategies/TwitchSdkLoader';
import * as loadYoutubeStrategy from './load-strategies/YoutubeSdkLoader';
import * as loadGoogleMapsStrategy from './load-strategies/GoogleMapsSdkLoader';
import * as loadRecaptchaStrategy from './load-strategies/RecaptchaSdkLoader';
import * as loadLineShareStrategy from './load-strategies/LineShareSdkLoader';

const loadStrategies = {
  facebook: loadFacebookStrategy.loadScript,
  vimeo: loadVimeoStrategy.loadScript,
  dailyMotion: loadDMStrategy.loadScript,
  twitch: loadTwitchStrategy.loadScript,
  youtube: loadYoutubeStrategy.loadScript,
  googleMaps: loadGoogleMapsStrategy.loadScript,
  recaptcha: loadRecaptchaStrategy.loadScript,
  lineShare: loadLineShareStrategy.loadScript,
};

type ScriptName = keyof typeof loadStrategies;
type ScriptLoadParams<T extends ScriptName> = Parameters<
  typeof loadStrategies[T]
>;
type ScriptLoadReturnValue<T extends ScriptName> = ReturnType<
  typeof loadStrategies[T]
>;

export interface WindowWithScriptLoader extends Window {
  loadScriptPromises?: Partial<
    { [key in ScriptName]: typeof loadStrategies[key] }
  >;
}

declare let window: WindowWithScriptLoader;

export function getScriptOrLoad<T extends ScriptName>(
  scriptName: T,
  ...params: ScriptLoadParams<T>
): ScriptLoadReturnValue<T> {
  window.loadScriptPromises = window.loadScriptPromises || {};
  const loadScriptPromise = window.loadScriptPromises[scriptName]
    ? window.loadScriptPromises[scriptName]
    : (loadStrategies[scriptName] as any)(...params);

  window.loadScriptPromises[scriptName] = loadScriptPromise;

  return loadScriptPromise;
}
