import { MinimizedChatLayouts, PublicDataDesign } from '@wix/inbox-common';

export const getMinimizedElementWidth = () =>
  document.getElementById('minimized-chat')?.offsetWidth;

interface Dimension {
  width: number;
  height: number;
}

export interface Dimensions {
  collapsed: Dimension;
  collapsedWithPopup: Dimension;
  expanded: Dimension;
  shortExpanded: Dimension;
}

const extraBuffer = 10; // for pimple, shadow, etc
const popupBorder = 10;
const sideSpacing = 20;
const widgetExpandedWidth = 340;
const widgetPopupMobileWidth = 189;
const iconWidth = 64;
const iconHeight = 64;
const floatingOrFixedHeight = 56;
const widgetExpandedHeight = 600;
const widgetShortExpandedHeight = widgetExpandedHeight - 100;
const bottomSpacingForFloating = 20;

const moreMessagesHeight = (isMobile) => (isMobile ? 24 : 34);
const popupBaseHeight = (isMobile) => (isMobile ? 190 : 170);

export const popupHeight = (isMobile) => {
  return (
    popupBaseHeight(isMobile) +
    moreMessagesHeight(isMobile) +
    extraBuffer +
    popupBorder
  );
};

export const getDimensions = (
  design: PublicDataDesign,
  isEditor: boolean,
  isSdkLoaded: boolean,
  isMobile: boolean,
): Dimensions => {
  const floatingOrFixedWidth: number =
    !isEditor && isSdkLoaded
      ? getMinimizedElementWidth() || widgetExpandedWidth
      : widgetExpandedWidth;
  const collapsedWith: number =
    design.minimizedChatLayout === MinimizedChatLayouts.Icon
      ? iconWidth
      : floatingOrFixedWidth;

  const bottomSpacing =
    design.minimizedChatLayout === MinimizedChatLayouts.Fixed
      ? 0
      : bottomSpacingForFloating;

  const widgetCollapsedHeight =
    design.minimizedChatLayout === MinimizedChatLayouts.Icon
      ? iconHeight
      : floatingOrFixedHeight;

  return {
    collapsed: {
      width: collapsedWith + sideSpacing + extraBuffer,
      height: widgetCollapsedHeight + bottomSpacing + extraBuffer,
    },
    collapsedWithPopup: {
      width:
        (isMobile ? widgetPopupMobileWidth : widgetExpandedWidth) +
        sideSpacing +
        extraBuffer,
      height:
        widgetCollapsedHeight +
        bottomSpacing +
        extraBuffer +
        popupHeight(isMobile),
    },
    expanded: {
      width: widgetExpandedWidth + sideSpacing + extraBuffer,
      height: widgetExpandedHeight + bottomSpacing + extraBuffer,
    },
    shortExpanded: {
      width: widgetExpandedWidth + sideSpacing + extraBuffer,
      height: widgetShortExpandedHeight + bottomSpacing + extraBuffer,
    },
  };
};
