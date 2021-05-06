export interface WindowWithRequire extends Window {
  require: any;
  define: any;
}

export const isRequireSupported = (window: Window) =>
  typeof (window as WindowWithRequire).require === 'function' &&
  typeof (window as WindowWithRequire).define === 'function' &&
  (window as WindowWithRequire).define.amd;
