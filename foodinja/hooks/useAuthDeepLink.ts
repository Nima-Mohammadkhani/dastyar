import { useEffect, useRef, useState, useCallback } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useExchangeCodeMutation, useGetUserInfoQuery } from '@/redux/service/app';
import { setAuthTokens, setUserData } from '@/redux/authSlice';
import { secureStorage } from '@/utils/secureStorage';

interface UseAuthDeepLinkResult {
  loading: boolean;
  error: Error | null;
  handled: boolean;
  handleWebViewRedirect: (url: string) => Promise<boolean>;
}

export function useAuthDeepLink(
  onSuccess?: () => void,
  onError?: (error: Error) => void
): UseAuthDeepLinkResult {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [handled, setHandled] = useState(false);

  const [exchangeCode] = useExchangeCodeMutation();
  const { refetch: refetchUserInfo } = useGetUserInfoQuery(undefined, {
    skip: true,
  });

  const processingRef = useRef(false);
  const processedCodesRef = useRef<Set<string>>(new Set());
  const initialUrlHandledRef = useRef<Set<string>>(new Set());
  const isMountedRef = useRef(true);

  const parseAuthCode = useCallback((url: string): string | null => {
    try {
      const parsed = Linking.parse(url);
      
      if (parsed.scheme !== 'foodinja') {
        return null;
      }
      
      if (parsed.path !== 'auth') {
        return null;
      }
      
      const code = parsed.queryParams?.code;
      
      if (
        !code ||
        typeof code !== 'string' ||
        code.trim().length < 10
      ) {
        console.warn('Invalid code format or too short');
        return null;
      }
      
      return code.trim();
    } catch (err) {
      console.error('Failed to parse URL:', err);
      return null;
    }
  }, []);

  const handleCodeExchange = useCallback(
    async (code: string): Promise<void> => {
      if (processedCodesRef.current.has(code)) {
        console.log('Code already processed, skipping:', code.substring(0, 10));
        return;
      }

      if (processingRef.current) {
        console.log('Already processing a code, skipping duplicate');
        return;
      }

      processingRef.current = true;
      
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      try {
        processedCodesRef.current.add(code);

        const result = await exchangeCode({ code }).unwrap();

        if (!result.access_token || !result.refresh_token) {
          throw new Error('Invalid token response: missing tokens');
        }

        await Promise.all([
          secureStorage.setToken(result.access_token),
          secureStorage.setRefreshToken(result.refresh_token),
        ]);

        dispatch(
          setAuthTokens({
            access_token: result.access_token,
            refresh_token: result.refresh_token,
          })
        );

        try {
          const userInfoResult = await refetchUserInfo();
          if (userInfoResult.data) {
            dispatch(setUserData(userInfoResult.data));
            await secureStorage.setUserData(JSON.stringify(userInfoResult.data));
          }
        } catch (userInfoError) {
          console.error('Failed to fetch user info:', userInfoError);
        }

        if (isMountedRef.current) {
          setHandled(true);
          setLoading(false);
        }

        try {
          router.dismissAll();
          router.replace('/(drawer)');
        } catch (navError) {
          console.error('Navigation error:', navError);
          router.replace('/(drawer)');
        }

        onSuccess?.();
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Failed to exchange authorization code');

        console.error('Code exchange error:', error);
        
        if (isMountedRef.current) {
          setError(error);
          setLoading(false);
          setHandled(true);
        }

        processedCodesRef.current.delete(code);

        onError?.(error);
      } finally {
        processingRef.current = false;
      }
    },
    [exchangeCode, dispatch, refetchUserInfo, router, onSuccess, onError]
  );

  const handleDeepLink = useCallback(
    async (url: string | null, isInitialUrl: boolean = false) => {
      if (!url) return;

      if (isInitialUrl && initialUrlHandledRef.current.has(url)) {
        console.log('Initial URL already processed, skipping');
        return;
      }

      console.log('Received deep link:', url);

      const code = parseAuthCode(url);
      if (!code) {
        return;
      }

      if (isInitialUrl) {
        initialUrlHandledRef.current.add(url);
      }

      await handleCodeExchange(code);
    },
    [parseAuthCode, handleCodeExchange]
  );

  const handleWebViewRedirect = useCallback(
    async (url: string): Promise<boolean> => {
      if (!url.startsWith('foodinja://auth')) {
        return false; 
      }

      const code = parseAuthCode(url);
      if (!code) {
        console.warn('Invalid auth URL in WebView:', url);
        return false;
      }

      await handleCodeExchange(code);
      return true;
    },
    [parseAuthCode, handleCodeExchange]
  );

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      if (!initialUrlHandledRef.current.has(event.url)) {
        handleDeepLink(event.url, false);
      }
    });

    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          handleDeepLink(url, true);
        }
      })
      .catch((err) => {
        console.error('Failed to get initial URL:', err);
        if (isMountedRef.current) {
          setError(new Error('Failed to process initial deep link'));
        }
      });

    return () => {
      isMountedRef.current = false;
      subscription.remove();
    };
  }, [handleDeepLink]);

  return {
    loading,
    error,
    handled,
    handleWebViewRedirect,
  };
}
