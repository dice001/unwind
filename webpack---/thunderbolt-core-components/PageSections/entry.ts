import { IThunderboltEntry } from '@wix/editor-elements-types';

import {
  registerComponentTypeUiTypes,
  UiTypesRegistrationMap,
} from '../../registration/registration';

const UiTypes: UiTypesRegistrationMap = {
  '': () => [
    import('./viewer/PageSections' /* webpackChunkName: "PageSections" */),
  ],
};

const entry: IThunderboltEntry = {
  loadComponent: registerComponentTypeUiTypes('PageSections', UiTypes),
};

export default entry;
