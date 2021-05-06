import { HostSdk } from '../types/host-sdk';
import { Dimensions } from './dimensions';

interface Resizer {
  expand(): Promise<void>;
  collapse(withPopup?: boolean): Promise<void>;
}

const getCollapsedDimension = (dimensions: Dimensions, withPopup: boolean) =>
  withPopup ? dimensions.collapsedWithPopup : dimensions.collapsed;

export const getResizer = (
  withQab: boolean,
  isMobile: boolean,
  hostSdk: HostSdk,
  dimensions: Dimensions,
): Resizer => {
  if (withQab) {
    return mobileQabResizer(hostSdk);
  }
  if (isMobile) {
    return mobileNonQabResizer(hostSdk, dimensions);
  }
  return desktopResizer(hostSdk, dimensions);
};

const mobileQabResizer = (hostSdk: HostSdk): Resizer => ({
  async expand() {
    hostSdk.showFullscreen();
  },
  async collapse() {
    hostSdk.hideFullscreen();
  },
});

const mobileNonQabResizer = (
  hostSdk: HostSdk,
  dimensions: Dimensions,
): Resizer => ({
  async expand() {
    await hostSdk.resizeTo('100%', '100%');
    hostSdk.showFullscreen();
  },
  async collapse(withPopup: boolean = false) {
    const dimension = getCollapsedDimension(dimensions, withPopup);
    await hostSdk.resizeTo(dimension.width, dimension.height);
    hostSdk.hideFullscreen();
  },
});

const desktopResizer = (hostSdk: HostSdk, dimensions: Dimensions): Resizer => {
  return {
    async expand() {
      const hostHeight = (await hostSdk.getScreenSize()).height;
      const minBuffer = 150;

      const size =
        hostHeight >= dimensions.expanded.height + minBuffer
          ? dimensions.expanded
          : dimensions.shortExpanded;

      await hostSdk.resizeTo(size.width, size.height);
    },
    async collapse(withPopup: boolean = false) {
      const dimension = getCollapsedDimension(dimensions, withPopup);
      await hostSdk.resizeTo(dimension.width, dimension.height);
    },
  };
};
