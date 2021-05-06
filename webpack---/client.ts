import {
  IThunderboltEntry,
  IThunderboltHostAPI,
} from '@wix/editor-elements-types';
import { importAll } from './build-utils';

const componentEntriesContext = require.context(
  './components',
  true,
  /entry\.ts$/,
);

const coreComponentsEntriesContext = require.context(
  './thunderbolt-core-components',
  true,
  /entry\.ts$/,
);

const componentEntries = importAll<IThunderboltEntry>(componentEntriesContext);

const coreComponentsEntries = importAll<IThunderboltEntry>(
  coreComponentsEntriesContext,
);

export function registerComponents(hostAPI: IThunderboltHostAPI) {
  [...coreComponentsEntries, ...componentEntries].forEach(
    ({ loadComponent }) => {
      loadComponent(hostAPI);
    },
  );
}
