import * as viewerAppModule from './viewer-app-module';

const {
  initAppForPage,
  createControllers,
  exports: platformExports,
} = viewerAppModule;

export { initAppForPage, createControllers, platformExports as exports };
