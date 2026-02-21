import { useState, useCallback, useEffect } from 'react';
import { useSendGuestChatMutation, useGetGuestStatusQuery } from '@/redux/service/app';
import { getDeviceId, getSessionId } from '@/utils/deviceId';
import type { GuestChatRequest, GuestChatResponse, GuestStatusResponse } from '@/types/api';

interface UseGuestChatResult {
  sendMessage: (query: string) => Promise<GuestChatResponse | undefined>;
  status: GuestStatusResponse | undefined;
  isLoading: boolean;
  isSending: boolean;
  error: any;
  deviceId: string | null;
  sessionId: string | null;
  refetchStatus: () => void;
}

export function useGuestChat(): UseGuestChatResult {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sendGuestChat, { isLoading: isSending, error }] = useSendGuestChatMutation();

  useEffect(() => {
    const initializeIds = async () => {
      const devId = await getDeviceId();
      const sessId = await getSessionId();
      setDeviceId(devId);
      setSessionId(sessId);
    };
    initializeIds();
  }, []);

  const {
    data: status,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = useGetGuestStatusQuery(
    { device_id: deviceId || '', session_id: sessionId || undefined },
    {
      skip: !deviceId,
    }
  );

  const sendMessage = useCallback(
    async (query: string): Promise<GuestChatResponse | undefined> => {
      if (!deviceId) {
        console.error('Device ID not available');
        return undefined;
      }

      if (!query.trim()) {
        console.error('Query is required');
        return undefined;
      }

      try {
        const request: GuestChatRequest = {
          query: query.trim(),
          device_id: deviceId,
          session_id: sessionId || undefined,
        };

        const result = await sendGuestChat(request).unwrap();
        
        refetchStatus();
        
        return result;
      } catch (err) {
        console.error('Error sending guest chat message:', err);
        throw err;
      }
    },
    [deviceId, sessionId, sendGuestChat, refetchStatus]
  );

  return {
    sendMessage,
    status,
    isLoading: isLoadingStatus,
    isSending,
    error,
    deviceId,
    sessionId,
    refetchStatus,
  };
}
