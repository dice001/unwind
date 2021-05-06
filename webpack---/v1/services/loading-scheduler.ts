let interactivityResolver;
const isInteractive = new Promise((resolve) => {
  interactivityResolver = resolve;
});

let connectivityResolver;
const isConnective = new Promise((resolve) => {
  connectivityResolver = resolve;
});

let paintResolver;
const isReadyToPaint = new Promise((resolve) => {
  paintResolver = resolve;
});

export const loadingScheduler = {
  onReadyToPaint() {
    return isReadyToPaint;
  },
  triggerPaint() {
    paintResolver();
  },
  onConnective() {
    return isConnective;
  },
  triggerConnectivity() {
    connectivityResolver();
  },
  onInteractive() {
    return isInteractive;
  },
  triggerInteractivity() {
    interactivityResolver();
  },
};

export const lazyLoaders = {
  interactivity: {
    chatSdk: () =>
      import(/* webpackChunkName: "chat-interactivity" */ '@wix/chat-sdk'),
  },
};
