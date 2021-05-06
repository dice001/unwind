import { BILogger } from '../types/bi-logger';
import { DeviceType, HostSdk } from '../types/host-sdk';
import filesize from 'filesize';

export const BI_EVENTS = {
  EXPAND_CHAT: { evid: 523 },
  SEND_MESSAGE: { evid: 524 },
  REALTIME_ACTIVITY: { evid: 530 },
  ADD_ATTACHMENT_CLICK: { evid: 563 },
  IMAGE_CLICK: { evid: 772 },
  CHAT_DISPLAYED: { evid: 701 },
  CALL_TO_ACTION_CLICK: { evid: 706 },
  LCF_SUBMISSION: { evid: 766 },
  COPY_COUPON_CODE: { evid: 767 },
  DEBUG: { evid: 572 },
  FILE_UPLOAD_FROM_CLIPBOARD: { evid: 726 },
};

export class WidgetBILogger {
  constructor(
    private readonly logger: BILogger,
    private readonly hostSdk: HostSdk,
  ) {}

  expandChatEvent({ direction, triggerBy, chatRoomType = '', host = 'Wix' }) {
    const mode = this.hostSdk.getViewMode();
    return this.logger.log({
      ...BI_EVENTS.EXPAND_CHAT,
      mode,
      widget_sub_type: host,
      direction,
      triggerBy,
      chatRoomType,
    });
  }

  copyCouponCode() {
    const mode = this.hostSdk.getViewMode();
    return this.logger.log({ ...BI_EVENTS.COPY_COUPON_CODE, mode });
  }

  lcfSubmission(isMessageEmpty: boolean | null) {
    const mode = this.hostSdk.getViewMode();
    return this.logger.log({
      ...BI_EVENTS.LCF_SUBMISSION,
      mode,
      message_empty: isMessageEmpty,
    });
  }

  fileUploadFromClipboard(
    file_name: string,
    file_size: number,
    fileFormat: string,
    chatRoomType: string = '',
    chatroomId: string | undefined,
    contact_id: string | undefined,
    drag_and_drop: boolean,
  ) {
    return this.logger.log({
      ...BI_EVENTS.FILE_UPLOAD_FROM_CLIPBOARD,
      chatroomId,
      chatRoomType,
      file_name,
      file_size: filesize(file_size || 0, { output: 'array', exponent: 1 })[0],
      fileFormat,
      contact_id,
      drag_and_drop,
      direction: 'contact - site',
      origin: 'web',
      platform: 'widget',
    });
  }

  imageClickEvent() {
    const mode = this.hostSdk.getViewMode();
    return this.logger.log({ ...BI_EVENTS.IMAGE_CLICK, mode });
  }

  callToActionClickEvent(url) {
    const mode = this.hostSdk.getViewMode();
    return this.logger.log({ ...BI_EVENTS.CALL_TO_ACTION_CLICK, url, mode });
  }

  sendMessageEvent({ chatRoomType = '', host, buttonAppId = '' }) {
    const mode = this.hostSdk.getViewMode();
    return this.logger.log({
      ...BI_EVENTS.SEND_MESSAGE,
      mode,
      chatRoomType,
      widget_sub_type: host,
      buttonAppId,
    });
  }

  chatDisplayedEvent(deviceType, layoutName) {
    const mode = this.hostSdk.getViewMode();
    const loadTime = Date.now() - window.startLoadTime;
    const isFullRender = /fullRender/.test(window.location.href);
    return this.logger.log({
      ...BI_EVENTS.CHAT_DISPLAYED,
      platform: deviceType === DeviceType.Mobile ? 'QAB' : 'desktop',
      load_time: loadTime,
      is_full_render: isFullRender,
      layoutName,
      mode,
      version: 'V2',
    });
  }

  attachmentClickEvent() {
    const mode = this.hostSdk.getViewMode();
    return this.logger.log({ ...BI_EVENTS.ADD_ATTACHMENT_CLICK, mode });
  }

  messageReceivedEvent(shard_id) {
    const mode = this.hostSdk.getViewMode();
    return this.logger.log({ ...BI_EVENTS.REALTIME_ACTIVITY, mode, shard_id });
  }
}
