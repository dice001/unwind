import { IThunderboltEntry } from '@wix/editor-elements-types';

import {
  registerComponentTypeUiTypes,
  UiTypesRegistrationMap,
} from '../../registration/registration';

const UiTypes: UiTypesRegistrationMap = {
  ThreeDeePageSkin: () => [
    import(
      './viewer/skinComps/ThreeDeePage/ThreeDeePageSkin.skin' /* webpackChunkName: "Page_ThreeDeePageSkin" */
    ),
  ],
  SloopyPageSkin: () => [
    import(
      './viewer/skinComps/SloopyPage/SloopyPageSkin.skin' /* webpackChunkName: "Page_SloopyPageSkin" */
    ),
  ],
  LiftedTopPageSkin: () => [
    import(
      './viewer/skinComps/LiftedTop/LiftedTopPageSkin.skin' /* webpackChunkName: "Page_LiftedTopPageSkin" */
    ),
  ],
  LiftedShadowPageSkin: () => [
    import(
      './viewer/skinComps/LiftedShadow/LiftedShadowPageSkin.skin' /* webpackChunkName: "Page_LiftedShadowPageSkin" */
    ),
  ],
  LiftedBottomPageSkin: () => [
    import(
      './viewer/skinComps/LiftedBottom/LiftedBottomPageSkin.skin' /* webpackChunkName: "Page_LiftedBottomPageSkin" */
    ),
  ],
  BasicPageSkin: () => [
    import(
      './viewer/skinComps/BasePage/BasicPageSkin.skin' /* webpackChunkName: "Page_BasicPageSkin" */
    ),
  ],
  BorderPageSkin: () => [
    import(
      './viewer/skinComps/BasePage/BorderPageSkin.skin' /* webpackChunkName: "Page_BorderPageSkin" */
    ),
  ],
  InnerShadowPageSkin: () => [
    import(
      './viewer/skinComps/BasePage/InnerShadowPageSkin.skin' /* webpackChunkName: "Page_InnerShadowPageSkin" */
    ),
  ],
  NoMarginPageSkin: () => [
    import(
      './viewer/skinComps/BasePage/NoMarginPageSkin.skin' /* webpackChunkName: "Page_NoMarginPageSkin" */
    ),
  ],
  ShinyIPageSkin: () => [
    import(
      './viewer/skinComps/BasePage/ShinyIPageSkin.skin' /* webpackChunkName: "Page_ShinyIPageSkin" */
    ),
  ],
  TransparentPageSkin: () => [
    import(
      './viewer/skinComps/BasePage/TransparentPageSkin.skin' /* webpackChunkName: "Page_TransparentPageSkin" */
    ),
  ],
  ResponsivePageWithColorBG: () => [
    import(
      './viewer/skinComps/Responsive/ResponsivePageWithColorBG.skin' /* webpackChunkName: "Page_ResponsivePageWithColorBG" */
    ),
  ],
  VerySimpleSkin: () => [
    import(
      './viewer/skinComps/VerySimple/VerySimpleSkin.skin' /* webpackChunkName: "Page_VerySimpleSkin" */
    ),
  ],
};

const entry: IThunderboltEntry = {
  loadComponent: registerComponentTypeUiTypes('Page', UiTypes),
};

export default entry;
