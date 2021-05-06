import { IThunderboltEntry } from '@wix/editor-elements-types';

import {
  registerComponentTypeUiTypes,
  UiTypesRegistrationMap,
} from '../../registration/registration';

const UiTypes: UiTypesRegistrationMap = {
  '': () => [
    import(
      './viewer/ContainerWrapper' /* webpackChunkName: "ContainerWrapper" */
    ),
  ],
};

const entry: IThunderboltEntry = {
  loadComponent: registerComponentTypeUiTypes('ContainerWrapper', UiTypes),
};

export default entry;
