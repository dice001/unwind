import { IThunderboltEntry } from '@wix/editor-elements-types';

import {
  registerComponentTypeUiTypes,
  UiTypesRegistrationMap,
} from '../../registration/registration';

const UiTypes: UiTypesRegistrationMap = {
  '': () => [
    import('./viewer/MasterPage' /* webpackChunkName: "MasterPage" */),
  ],
};

const entry: IThunderboltEntry = {
  loadComponent: registerComponentTypeUiTypes('MasterPage', UiTypes),
};

export default entry;
