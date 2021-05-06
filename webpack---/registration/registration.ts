import { IThunderboltHostAPI } from '@wix/editor-elements-types';
import React from 'react';

export type UiTypesRegistrationMap = Record<
  string,
  () =>
    | [Promise<{ default: React.FC<any> }>, Promise<{ default: any }>]
    | [Promise<{ default: React.FC<any> }>]
    | Promise<{ default: React.FC<any> }>
>;

export const registerComponentTypeUiTypes = (
  componentType: string,
  uiTypes: UiTypesRegistrationMap,
) => (hostAPI: IThunderboltHostAPI) => {
  Object.keys(uiTypes).forEach(uiType =>
    hostAPI.registerComponent(
      componentType,
      () => {
        const moduleLoaders = uiTypes[uiType]();
        return Promise.all(
          Array.isArray(moduleLoaders) ? moduleLoaders : [moduleLoaders],
        ).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            ...(controllerModule && { controller: controllerModule.default }),
          };
        });
      },
      uiType === '' ? undefined : uiType,
    ),
  );
};
