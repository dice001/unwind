import { AppState } from '../hooks/app-state';
import { Availability } from '@wix/inbox-common';
import { AvailabilityStatus } from '@wix/chat-web';

// TODO if no availability data > should be available?
const calculateAvailability = (availability: Availability) => {
  const now = Date.now();
  return availability?.onlinePeriods?.some((period) => {
    const { start = 0, end = 0 } = period;
    return start < now && end > now;
  });
};

export const appStateFromChatInitResult = (
  chatInitResult,
): Partial<AppState> => ({
  coreChatToken: chatInitResult.coreChatToken,
  businessChatroomId: chatInitResult.derivedChatroomId,
  chatroomId: chatInitResult.chatroomId,
  visitorId: chatInitResult.visitorId,
  visitorInstanceId: chatInitResult.visitorInstanceId,
  correlationId: chatInitResult.correlationId,
  isBranded: chatInitResult.isBranded,
  shardId: chatInitResult.shardId,
  availabilityStatus: calculateAvailability(chatInitResult.availability)
    ? AvailabilityStatus.Available
    : AvailabilityStatus.Away,
  firebase: {
    authKey: chatInitResult.authKey,
    options: chatInitResult.options,
    presencePath: chatInitResult.presencePath,
  },
  location: chatInitResult.location,
  timestamp: chatInitResult.timestamp,
});
