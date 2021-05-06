import { EditorSettings } from '@wix/inbox-common';
import { DeviceType, ScreenSize, HostSdk, ViewMode } from '../types/host-sdk';
import { ENDPOINTS } from './server-api';
import { CorvidCommand, CorvidReportEvent } from '../hooks/corvid-api';

export class WixHostSdk implements HostSdk {
  constructor(private readonly Wix: any, private readonly origin) {}

  reportApplicationLoaded(): void {
    this.Wix.Performance.applicationLoaded();
  }

  resizeTo(width: number | string, height: number | string): Promise<void> {
    return new Promise((resolve) =>
      this.Wix.resizeWindow(width, height, resolve),
    );
  }

  showFullscreen(): void {
    this.Wix.Mobile.showFullscreen();
  }

  hideFullscreen(): void {
    this.Wix.Mobile.hideFullscreen();
  }

  getInstanceId(): string {
    try {
      return this.Wix.Utils.getInstanceId();
    } catch (e) {
      return '';
    }
  }

  getDeviceType(): DeviceType {
    return this.Wix.Utils.getDeviceType();
  }

  getViewMode(): ViewMode {
    return this.Wix.Utils.getViewMode();
  }

  getMetaSiteId(): string {
    return this.Wix.Utils.getInstanceValue('metaSiteId');
  }

  getResizedImgUrl = (
    relativeUrl: string,
    width: number,
    height: number,
  ): string => {
    return this.Wix.Utils.Media.getResizedImageUrl(relativeUrl, width, height);
  };

  getAscendUpgradeUrl(): string {
    return this.Wix.Utils.getAscendUpgradeUrl({
      msid: this.getMetaSiteId(),
      slug: 'wix-chat',
      origin: 'widget_banner',
    });
  }

  async getVendorProductIds(): Promise<{ chat: string; ascend: string }> {
    const ascendAppDefId = 'ee21fe60-48c5-45e9-95f4-6ca8f9b1c9d9';

    const chatVendorProductId = this.Wix.Utils.getInstanceValue(
      'vendorProductId',
    );
    const ascendVendorProductId = await new Promise<string>((resolve) =>
      this.Wix.SuperApps.getAppVendorProductId(ascendAppDefId, resolve),
    );

    return {
      chat: chatVendorProductId,
      ascend: ascendVendorProductId,
    };
  }

  getCurrentPageId(): Promise<any> {
    return new Promise((resolve) => {
      this.Wix.getCurrentPageId(resolve);
    });
  }

  getPageTitle(): Promise<any> {
    return new Promise((resolve) => {
      this.Wix.Settings.getSiteInfo((siteInfo) => {
        resolve(siteInfo.pageTitle);
      });
    });
  }

  updateQab({
    visible,
    notifications,
    color,
    iconSvgContent,
  }: {
    visible?: boolean;
    notifications?: boolean;
    color?: string;
    iconSvgContent?: string;
  }): void {
    this.Wix.Mobile.setMobileActionBarButton({
      visible,
      notifications,
      color,
      iconSvgContent,
    });
  }

  private subscribeToEvent(event: string, handler: Function): () => void {
    this.Wix.addEventListener(event, handler);
    return () => this.Wix.removeEventListener(event, handler);
  }

  publishToPubSub(event: CorvidReportEvent | string, data: any = {}): void {
    this.Wix.PubSub.publish(event, data, true);
  }

  subscribeToPubSub(
    event: CorvidCommand,
    handler: () => any,
    receivePastEvents: boolean = false,
  ): void {
    this.Wix.PubSub.subscribe(event, handler, receivePastEvents);
  }

  onQabClick(handler: () => void): () => void {
    return this.subscribeToEvent(
      this.Wix.Events.QUICK_ACTION_TRIGGERED,
      handler,
    );
  }

  subscribeToEditModeChange(
    handler: ({ editMode }: { editMode: ViewMode }) => void,
  ) {
    return this.subscribeToEvent(this.Wix.Events.EDIT_MODE_CHANGE, handler);
  }

  subscribeToPageNavigation(handler: () => void): () => void {
    return this.subscribeToEvent(this.Wix.Events.PAGE_NAVIGATION, handler);
  }

  subscribeToPublicDataChange(handler: (publicData) => void): () => void {
    return this.subscribeToEvent(this.Wix.Events.PUBLIC_DATA_CHANGED, handler);
  }

  subscribeToThemeChange(handler: (theme) => void): () => void {
    return this.subscribeToEvent(this.Wix.Events.THEME_CHANGE, handler);
  }

  subscribeToSettingsChange(handler: (settings) => void): () => void {
    return this.subscribeToEvent(this.Wix.Events.SETTINGS_UPDATED, handler);
  }

  subscribeToSettingsClose(
    handler: ({ type, tpaType }: { type: string; tpaType: string }) => void,
  ): () => void {
    return this.subscribeToEvent(this.Wix.Events.EDITOR_EVENT, handler);
  }

  getPublicDataFromAllScopes(): Promise<{
    APP: Partial<EditorSettings['publicData'] | undefined>;
    COMPONENT: Partial<EditorSettings['publicData'] | undefined>;
  }> {
    return new Promise((resolve) => {
      this.Wix.Data.Public.getAll(
        (res) => resolve(res),
        (e) => {
          console.error('could not read public data', e);
        },
      );
    });
  }

  async getPublicData(): Promise<Partial<EditorSettings['publicData']>> {
    const publicData = await this.getPublicDataFromAllScopes();
    const compData = publicData?.COMPONENT || {};
    const appData = publicData?.APP || {};
    return { ...appData, ...compData };
  }

  async setPublicData(namespace: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.Wix.Data.Public.set(
        namespace,
        data,
        { scope: this.Wix.Data.SCOPE.COMPONENT },
        () => resolve(),
        (e) => {
          console.error(`failed to set public data`, e);
          reject(e);
        },
      );
    });
  }

  getSiteColors(): Promise<EditorSettings['siteColors']> {
    return new Promise((resolve) => {
      this.Wix.Styles.getSiteColors(resolve);
    });
  }

  getTextPresets(): Promise<EditorSettings['textPresets']> {
    return new Promise((resolve) => {
      this.Wix.Styles.getSiteTextPresets(resolve);
    });
  }

  getStyleParams(): Promise<Partial<EditorSettings['styleParams']>> {
    return new Promise((resolve) => {
      this.Wix.Styles.getStyleParams(resolve);
    });
  }

  trackEvent(event: string, param: any) {
    try {
      this.Wix.Analytics.trackEvent(event, param);
    } catch (e) {
      //swallow. This method works only in `site` mode and crashes on any other mode.
    }
  }
  openImagePreview(
    imageUrl: string,
    imageName: string,
    imageSize: string,
    buttonColor: string,
    font: string,
    textColor: string,
    width?: string | number,
    height?: string | number,
  ) {
    const url = `${this.origin}${
      ENDPOINTS.IMAGE_PREVIEW_PAGE
    }?url=${encodeURIComponent(imageUrl)}&fileName=${encodeURIComponent(
      imageName,
    )}&fileSize=${imageSize}&buttonColor=${encodeURIComponent(
      buttonColor,
    )}&textColor=${encodeURIComponent(
      textColor,
    )}&fontFamily=${encodeURIComponent(font)}`;
    this.Wix.openModal(url, width, height, undefined, this.Wix.Theme.BARE);
  }
  navigateToSection(options: Object, state: string, onFailure: Function) {
    this.Wix.Utils.navigateToSection(options, state, onFailure);
  }
  openUrl(url: string) {
    window.open(url);
  }
  getAid() {
    return this.Wix.Utils.getInstanceValue('aid');
  }

  getCurrentMember() {
    return new Promise((resolve) => {
      this.Wix.currentMember((member) =>
        resolve({
          attributes: { privacyStatus: member?.attributes?.privacyStatus },
          status: member?.status,
        }),
      );
    });
  }

  getScreenSize() {
    return new Promise<ScreenSize>((resolve) => {
      this.Wix.getBoundingRectAndOffsets((data) => {
        resolve({
          width: data.rect.right,
          height: data.rect.bottom,
        });
      });
    });
  }
}
