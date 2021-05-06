import { EditorSettings } from '@wix/inbox-common';
import { CorvidCommand, CorvidReportEvent } from '../hooks/corvid-api';

export enum ViewMode {
  Site = 'site',
  Preview = 'preview',
  Editor = 'editor',
  Standalone = 'standalone',
}

export enum DeviceType {
  Desktop = 'desktop',
  Mobile = 'mobile',
}

export interface ScreenSize {
  width: number;
  height: number;
}

export interface HostSdk {
  reportApplicationLoaded(): void;
  resizeTo(width: number | string, height: number | string): Promise<void>;
  showFullscreen(): void;
  hideFullscreen(): void;
  getInstanceId(): string;
  getDeviceType(): DeviceType;
  getViewMode(): ViewMode;
  getMetaSiteId(): string;
  getResizedImgUrl(relativeUrl: string, width: number, height: number): string;
  getAscendUpgradeUrl(): string;
  getVendorProductIds(): Promise<{ chat: string; ascend: string }>;
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
  }): void;
  onQabClick(handler: () => void): () => void;
  subscribeToEditModeChange(
    handler: ({ editMode }: { editMode: ViewMode }) => void,
  ): () => void;
  subscribeToPublicDataChange(
    handler: (publicData: Partial<EditorSettings['publicData']>) => void,
  ): () => void;
  subscribeToThemeChange(
    handler: (theme: {
      siteColors: Partial<EditorSettings['siteColors']>;
      style: Partial<EditorSettings['styleParams']>;
    }) => void,
  ): () => void;
  subscribeToSettingsChange(handler: (settings) => void): () => void;
  subscribeToSettingsClose(
    handler: ({ type, tpaType }: { type: string; tpaType: string }) => void,
  ): () => void;
  subscribeToPageNavigation(handler: () => void): () => void;
  publishToPubSub(event: CorvidReportEvent | string, data?: any): void;
  subscribeToPubSub(
    event: CorvidCommand,
    handler: () => any,
    receivePastEvents?: boolean,
  ): void;
  getPublicData(): Promise<Partial<EditorSettings['publicData']>>;
  setPublicData(namespace: string, data: any): Promise<void>;
  getSiteColors(): Promise<EditorSettings['siteColors']>;
  getTextPresets(): Promise<EditorSettings['textPresets']>;
  getStyleParams(): Promise<Partial<EditorSettings['styleParams']>>;
  trackEvent(event: string, param: any): void;
  openImagePreview(
    fileUrl: string,
    fileName: string,
    fileSize: string,
    buttonColor: string,
    font: string,
    textColor: string,
    width?: string | number,
    height?: string | number,
  ): void;
  getCurrentPageId(): Promise<string>;
  getPageTitle(): Promise<string>;
  navigateToSection(options: Object, state: string, onFailure: Function): void;
  openUrl(url: string): void;
  getAid(): string;
  getCurrentMember(): Promise<any>;
  getScreenSize(): Promise<ScreenSize>;
}
