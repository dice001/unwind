import { iframeAppBiLoggerFactory } from '@wix/iframe-app-bi-logger';

export const biConstants = {
  BI_END_POINT: 'engage',
  BI_ENGAGE_SRC: 5,
};

export const createWixBILogger = (Wix, biEventsMap) => {
  let logger;
  try {
    logger = iframeAppBiLoggerFactory(Wix, {
      endpoint: biConstants.BI_END_POINT,
    })
      .setEvents(biEventsMap)
      .updateDefaults({
        src: biConstants.BI_ENGAGE_SRC,
        app_instance_id: Wix.Utils.getInstanceId(),
        bi_token: Wix.Utils.getInstanceValue('biToken'),
        visitor_id: Wix.Utils.getInstanceValue('aid'),
        is_social: false, // TODO
        is_business: true, // TODO
        mode: Wix.Utils.getViewMode(),
      })
      .logger();
  } catch (ex) {
    console.error('could not init wix bi logger', ex);
    logger = { log: (x) => x };
  }
  return logger;
};
