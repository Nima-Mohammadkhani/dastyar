/**
 * FoodAI API Client Examples
 * Usage examples for frontend developers
 */

// ============ SETUP ============

const API_BASE_URL = 'https://foodinja.ir/api';
let accessToken: string | null = null;
let refreshToken: string | null = null;

// ============ Helper Functions ============

/**
 * Make API request with error handling
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (requiresAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && refreshToken) {
      console.log('Token expired, attempting to refresh...');
      await refreshAccessToken();
      return apiRequest(endpoint, options, requiresAuth); // Retry request
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
}

// ============ AUTHENTICATION ============

/**
 * Example 1: Handle OAuth Redirect
 * This runs after Google redirects back to your app
 */
async function handleOAuthRedirect() {
  const params = new URLSearchParams(window.location.search);
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');

  if (access_token && refresh_token) {
    accessToken = access_token;
    refreshToken = refresh_token;

    // Store tokens securely (use localStorage, sessionStorage, or secure cookies)
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);

    console.log('✅ User authenticated successfully');
    return true;
  }

  return false;
}

/**
 * Example 2: Refresh Access Token
 */
async function refreshAccessToken() {
  if (!refreshToken) {
    console.error('No refresh token available');
    return false;
  }

  try {
    const response = await apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }, false);

    accessToken = response.access_token;
    localStorage.setItem('accessToken', accessToken);

    console.log('✅ Token refreshed');
    return true;
  } catch (error) {
    console.error('Failed to refresh token', error);
    // Redirect to login
    window.location.href = '/login';
    return false;
  }
}

/**
 * Example 3: Logout
 */
function logout() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}

// ============ USER ENDPOINTS ============

/**
 * Example 4: Get Current User Info
 */
async function getCurrentUserInfo() {
  const response = await apiRequest('/users/info');

  const userInfo = {
    id: response.id,
    email: response.email,
    name: response.name,
    tokenLimit: response.token_limit,
    tokenUsed: response.token_used,
    remainingTokens: response.remaining_tokens,
  };

  console.log('Current User:', userInfo);
  return userInfo;
}

// ============ CHAT ENDPOINTS ============

/**
 * Example 5: Send Chat Message
 */
async function sendMessage(query: string, conversationId?: number) {
  const response = await apiRequest('/chat/chat', {
    method: 'POST',
    body: JSON.stringify({
      query,
      conversation_id: conversationId || null,
      history: [],
    }),
  });

  return {
    response: response.response,
    conversationId: response.conversation_id,
    isNewConversation: response.new_conversation,
  };
}

/**
 * Example 6: Send Message with History
 */
async function sendMessageWithHistory(
  query: string,
  history: Array<{ role: string; content: string }>,
  conversationId?: number
) {
  const response = await apiRequest('/chat/chat', {
    method: 'POST',
    body: JSON.stringify({
      query,
      conversation_id: conversationId || null,
      history: history.slice(-7), // Last 7 messages
    }),
  });

  return {
    response: response.response,
    conversationId: response.conversation_id,
  };
}

/**
 * Example 7: Get Token Status
 */
async function getTokenStatus() {
  const response = await apiRequest('/chat/tokens/status');

  return {
    userID: response.user_id,
    tokenLimit: response.token_limit,
    tokenUsed: response.token_used,
    remainingTokens: response.remaining_tokens,
    lastReset: response.last_token_reset,
    nextReset: response.next_reset,
  };
}

// ============ CONVERSATION ENDPOINTS ============

/**
 * Example 8: Get All Conversations
 */
async function getConversations() {
  const response = await apiRequest('/chat/conversations');

  return response.conversations.map((conv: any) => ({
    id: conv.conversation_id,
    title: conv.title,
    createdAt: conv.created_at,
    updatedAt: conv.updated_at,
  }));
}

/**
 * Example 9: Get Conversation Messages
 */
async function getConversationMessages(conversationId: number) {
  const response = await apiRequest(`/chat/conversations/${conversationId}`);

  return {
    id: response.conversation_id,
    title: response.title,
    messages: response.messages.map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.created_at,
    })),
    totalMessages: response.total_messages,
  };
}

/**
 * Example 10: Delete Conversation
 */
async function deleteConversation(conversationId: number) {
  const response = await apiRequest(`/chat/conversations/${conversationId}`, {
    method: 'DELETE',
  });

  console.log('✅ Conversation deleted:', response.conversation_id);
  return response;
}

/**
 * Example 11: Restore Conversation
 */
async function restoreConversation(conversationId: number) {
  const response = await apiRequest(
    `/chat/conversations/${conversationId}/restore`,
    {
      method: 'POST',
    }
  );

  console.log('✅ Conversation restored:', response.conversation_id);
  return response;
}

/**
 * Example 12: Get Deleted Conversations
 */
async function getDeletedConversations() {
  const response = await apiRequest('/chat/conversations/deleted/list');

  return response.conversations.map((conv: any) => ({
    id: conv.conversation_id,
    title: conv.title,
    deletedAt: conv.deleted_at,
  }));
}

// ============ USAGE EXAMPLES IN REACT ============

// Example React Component: Chat Interface
/**
 * 
import React, { useState, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number>();
  const [tokenStatus, setTokenStatus] = useState(null);

  // Load token status on mount
  useEffect(() => {
    loadTokenStatus();
  }, []);

  async function loadTokenStatus() {
    const status = await getTokenStatus();
    setTokenStatus(status);
  }

  async function handleSendMessage() {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const result = await sendMessageWithHistory(
        input,
        messages,
        conversationId
      );

      // Update conversation ID if new conversation was created
      if (result.conversationId && !conversationId) {
        setConversationId(result.conversationId);
      }

      // Parse HTML response back to text for display
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = result.response;
      const assistantMessage: Message = {
        role: 'assistant',
        content: tempDiv.textContent || result.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Reload token status
      await loadTokenStatus();
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error to user
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <div className="token-status">
        {tokenStatus && (
          <p>
            Tokens: {tokenStatus.remainingTokens} / {tokenStatus.tokenLimit}
          </p>
        )}
      </div>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={loading}
          placeholder="Ask about cooking..."
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
 */

// ============ ERROR HANDLING ============

/**
 * Example 13: Error Handling Utility
 */
function handleApiError(error: any) {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes('401')) {
      console.error('Authentication failed - redirecting to login');
      logout();
    } else if (message.includes('403')) {
      console.error('Token limit exceeded');
      // Show modal to user
    } else if (message.includes('404')) {
      console.error('Resource not found');
    } else {
      console.error('API Error:', message);
    }
  }
}

// ============ INITIALIZATION ============

// On app startup, restore tokens from storage
window.addEventListener('load', () => {
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  if (storedAccessToken && storedRefreshToken) {
    accessToken = storedAccessToken;
    refreshToken = storedRefreshToken;
    console.log('✅ Tokens restored from storage');
  }
});

// ============ EXPORT ============

export {
  apiRequest,
  handleOAuthRedirect,
  refreshAccessToken,
  logout,
  getCurrentUserInfo,
  sendMessage,
  sendMessageWithHistory,
  getTokenStatus,
  getConversations,
  getConversationMessages,
  deleteConversation,
  restoreConversation,
  getDeletedConversations,
};
