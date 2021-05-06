import { IThunderboltEntry } from '@wix/editor-elements-types';

import {
  registerComponentTypeUiTypes,
  UiTypesRegistrationMap,
} from '../../registration/registration';

const UiTypes: UiTypesRegistrationMap = {
  '': () => [
    import(
      './viewer/ResponsiveContainer' /* webpackChunkName: "ResponsiveContainer" */
    ),
  ],
};

const entry: IThunderboltEntry = {
  loadComponent: registerComponentTypeUiTypes('ResponsiveContainer', UiTypes),
};

export default entry;
