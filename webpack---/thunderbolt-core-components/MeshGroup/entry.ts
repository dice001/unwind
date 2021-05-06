import { IThunderboltEntry } from '@wix/editor-elements-types';

import {
  registerComponentTypeUiTypes,
  UiTypesRegistrationMap,
} from '../../registration/registration';

const UiTypes: UiTypesRegistrationMap = {
  '': () => [import('./viewer/MeshGroup' /* webpackChunkName: "MeshGroup" */)],
};

const entry: IThunderboltEntry = {
  loadComponent: registerComponentTypeUiTypes('MeshGroup', UiTypes),
};

export default entry;
