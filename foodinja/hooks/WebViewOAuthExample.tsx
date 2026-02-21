import React, { useState, useRef } from 'react';
import { View, Modal, ActivityIndicator, Alert, Pressable, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useAuthDeepLink } from './useAuthDeepLink';
import { useTheme } from '@/constants/theme';

interface WebViewOAuthProps {
  loginUrl: string;
  onClose: () => void;
  onError?: (error: Error) => void;
}

export function WebViewOAuth({
  loginUrl,
  onClose,
  onError,
}: WebViewOAuthProps) {
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const { handleWebViewRedirect, loading: authLoading } = useAuthDeepLink(
    () => {
      console.log('OAuth authentication successful');
      handleClose();
    },
    (error) => {
      console.error('OAuth authentication failed:', error);
      if (onError) {
        onError(error);
      } else {
        Alert.alert(
          'Authentication Failed',
          error.message || 'Failed to authenticate. Please try again.',
          [{ text: 'OK', onPress: handleClose }]
        );
      }
    }
  );

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleShouldStartLoadWithRequest = async (
    request: { url: string }
  ): Promise<boolean> => {
    const { url } = request;

    if (url.startsWith('foodinja://auth')) {
      console.log('Intercepted OAuth redirect:', url);

      const handled = await handleWebViewRedirect(url);

      if (handled) {
        return false;
      }
      return false;
    }
    return true;
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    
    if (!nativeEvent.url?.startsWith('foodinja://')) {
      Alert.alert(
        'Loading Error',
        'Failed to load the login page. Please check your internet connection.',
        [{ text: 'OK', onPress: handleClose }]
      );
    }
  };

  const handleUserCancel = () => {
    Alert.alert(
      'Cancel Login',
      'Are you sure you want to cancel the login process?',
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: handleClose,
        },
      ]
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleUserCancel}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.neutral[200],
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.neutral[50],
            }}
          >
            Sign In
          </Text>
          <Pressable onPress={handleUserCancel}>
            <Ionicons
              name="close"
              size={24}
              color={colors.neutral[50]}
            />
          </Pressable>
        </View>

        <WebView
          ref={webViewRef}
          source={{ uri: loginUrl }}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsBackForwardNavigationGestures={false}
          style={{ flex: 1 }}
        />

        {(isLoading || authLoading) && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: colors.background,
                padding: 20,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" color={colors.primary[500]} />
              <Text
                style={{
                  marginTop: 10,
                  color: colors.neutral[50],
                  fontSize: 14,
                }}
              >
                {authLoading ? 'Authenticating...' : 'Loading...'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}