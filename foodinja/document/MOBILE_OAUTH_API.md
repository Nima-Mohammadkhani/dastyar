# مستندات OAuth برای موبایل اپ

## 📱 OAuth Flow Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Mobile    │         │   Backend    │         │   Google    │
│     App     │         │   Server     │         │    OAuth    │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                       │                          │
       │  1. Open WebView      │                          │
       │  GET /users/mobile/   │                          │
       │      login            │                          │
       ├──────────────────────>│                          │
       │                       │                          │
       │                       │  2. Redirect to Google  │
       │                       ├─────────────────────────>│
       │                       │                          │
       │                       │  3. User Login          │
       │                       │<─────────────────────────┤
       │                       │                          │
       │                       │  4. Google callback     │
       │                       │     with OAuth code     │
       │                       │<─────────────────────────┤
       │                       │                          │
       │                       │  5. Generate auth code  │
       │                       │     Store in Redis      │
       │                       │                          │
       │  6. Redirect to app   │                          │
       │  foodinja://auth?     │                          │
       │  code=XXX             │                          │
       │<──────────────────────┤                          │
       │                       │                          │
       │  7. Exchange code     │                          │
       │  POST /exchange-code  │                          │
       │  {code: "XXX"}        │                          │
       ├──────────────────────>│                          │
       │                       │                          │
       │  8. Return tokens     │                          │
       │  {access_token,       │                          │
       │   refresh_token}      │                          │
       │<──────────────────────┤                          │
       │                       │                          │
```

---

## 🔐 API Endpoints

### 1. شروع OAuth Login

**Endpoint:** `GET /api/users/mobile/login`

**Purpose:** شروع فرآیند احراز هویت با Google OAuth

**استفاده:**
```javascript
// در React Native WebView
const loginUrl = 'https://foodinja.ir/api/users/mobile/login';
webView.open(loginUrl);
```

**Response:** Redirect به صفحه Google OAuth

**نکات:**
- این endpoint کاربر را به صفحه لاگین Google منتقل می‌کند
- نیازی به authentication ندارد
- باید در WebView باز شود

---

### 2. Google OAuth Callback (Internal)

**Endpoint:** `GET /api/users/mobile/auth`

**Purpose:** پردازش callback از Google و redirect به اپ

**این endpoint توسط Google فراخوانی می‌شود، نه موبایل اپ**

**Response:** Redirect به موبایل اپ
```
foodinja://auth?code=AUTHORIZATION_CODE
```

**در صورت خطا:**
```
foodinja://auth?error=oauth_failed
foodinja://auth?error=no_token
foodinja://auth?error=no_email
foodinja://auth?error=server_error
```

---

### 3. تبدیل Authorization Code به Tokens

**Endpoint:** `POST /api/exchange-code`

**Purpose:** دریافت JWT tokens با استفاده از authorization code

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "AUTHORIZATION_CODE_FROM_DEEP_LINK"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

**400 Bad Request** - فرمت code نامعتبر است:
```json
{
  "statusCode": 400,
  "message": "Invalid authorization code format"
}
```

**401 Unauthorized** - code منقضی شده یا نامعتبر است:
```json
{
  "statusCode": 401,
  "message": "Authorization code expired or invalid"
}
```

**404 Not Found** - کاربر یافت نشد:
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

**500 Internal Server Error** - خطای سرور:
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 📲 پیاده‌سازی در موبایل اپ

### React Native Example

```javascript
import React, { useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { Linking } from 'react-native';

const GoogleLoginScreen = () => {
  const [showWebView, setShowWebView] = useState(false);
  const webViewRef = useRef(null);

  // مرحله 1: باز کردن WebView برای لاگین
  const startGoogleLogin = () => {
    setShowWebView(true);
  };

  // مرحله 2: گوش دادن به deep link
  React.useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url;
      
      // چک کردن اینکه URL مربوط به OAuth callback است
      if (url.startsWith('foodinja://auth')) {
        setShowWebView(false); // بستن WebView
        
        // استخراج code از URL
        const params = new URLSearchParams(url.split('?')[1]);
        const code = params.get('code');
        const error = params.get('error');
        
        if (error) {
          console.error('OAuth error:', error);
          alert('خطا در احراز هویت');
          return;
        }
        
        if (code) {
          await exchangeCodeForTokens(code);
        }
      }
    };

    // اضافه کردن listener برای deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // چک کردن اگر اپ از طریق deep link باز شده
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // مرحله 3: تبدیل code به tokens
  const exchangeCodeForTokens = async (code) => {
    try {
      const response = await fetch('https://foodinja.ir/api/exchange-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        // ذخیره tokens
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('refresh_token', data.refresh_token);
        
        // انتقال به صفحه اصلی
        navigation.navigate('Home');
      } else {
        console.error('Token exchange failed:', data);
        alert('خطا در احراز هویت');
      }
    } catch (error) {
      console.error('Exchange code error:', error);
      alert('خطا در ارتباط با سرور');
    }
  };

  // مرحله 4: Intercept کردن redirect در WebView
  const handleWebViewNavigationStateChange = (navState) => {
    const { url } = navState;
    
    // اگر URL به foodinja:// شروع شد، از WebView خارج شو
    if (url.startsWith('foodinja://auth')) {
      setShowWebView(false);
      
      // استخراج code
      const params = new URLSearchParams(url.split('?')[1]);
      const code = params.get('code');
      const error = params.get('error');
      
      if (error) {
        alert('خطا در احراز هویت');
        return false; // جلوگیری از navigation
      }
      
      if (code) {
        exchangeCodeForTokens(code);
      }
      
      return false; // جلوگیری از navigation
    }
    
    return true; // اجازه navigation
  };

  return (
    <View>
      {showWebView ? (
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://foodinja.ir/api/users/mobile/login' }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onShouldStartLoadWithRequest={(request) => {
            // Intercept deep links در iOS
            if (request.url.startsWith('foodinja://')) {
              handleWebViewNavigationStateChange({ url: request.url });
              return false;
            }
            return true;
          }}
        />
      ) : (
        <Button title="ورود با Google" onPress={startGoogleLogin} />
      )}
    </View>
  );
};
```

---

## ⚙️ تنظیمات Google Cloud Console

### گام 1: ایجاد پروژه در Google Cloud Console

1. به [Google Cloud Console](https://console.cloud.google.com) بروید
2. یک پروژه جدید بسازید یا پروژه موجود را انتخاب کنید

### گام 2: فعال کردن Google OAuth API

1. به **APIs & Services** > **Library** بروید
2. **Google+ API** را جستجو و فعال کنید

### گام 3: ایجاد OAuth 2.0 Credentials

1. به **APIs & Services** > **Credentials** بروید
2. روی **Create Credentials** > **OAuth 2.0 Client ID** کلیک کنید
3. **Application type**: Web application
4. **Name**: FoodAI Backend
5. **Authorized redirect URIs** اضافه کنید:
   ```
   https://foodinja.ir/api/users/auth
   https://foodinja.ir/api/users/mobile/auth
   http://localhost:8000/api/users/mobile/auth  (برای development)
   ```
6. روی **Create** کلیک کنید
7. **Client ID** و **Client Secret** را کپی کنید

### گام 4: تنظیم OAuth Consent Screen

1. به **OAuth consent screen** بروید
2. **User Type**: External
3. اطلاعات اپلیکیشن را پر کنید:
   - **App name**: FoodAI
   - **User support email**: your-email@domain.com
   - **Developer contact**: your-email@domain.com
4. **Scopes** اضافه کنید:
   - `email`
   - `profile`
   - `openid`

---

## 🔧 تنظیمات Backend

### متغیرهای محیطی (.env)

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=https://foodinja.ir/api/users/auth

# Redis (برای ذخیره authorization codes)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# JWT
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
```

### نصب Dependencies

```bash
pip install authlib httpx aioredis
```

---

## 🔒 امنیت

### Authorization Code

- **طول**: 32 کاراکتر (حداقل 10)
- **فرمت**: URL-safe base64
- **TTL**: 10 دقیقه
- **Single-Use**: پس از استفاده حذف می‌شود
- **ذخیره‌سازی**: Redis

### JWT Tokens

- **Access Token**: عمر کوتاه (15-60 دقیقه)
- **Refresh Token**: عمر طولانی (7-30 روز)
- **Algorithm**: HS256
- **Payload**: 
  ```json
  {
    "sub": "user_id",
    "roles": [1, 2, 3]
  }
  ```

### Deep Link Security

- **Scheme**: `foodinja://` (باید در app.json تعریف شود)
- **Path**: `auth` (دقیقاً)
- **Parameter**: `code` (الزامی)

---

## 🧪 تست کردن

### 1. تست از طریق Browser

```bash
# باز کردن این URL در مرورگر
https://foodinja.ir/api/users/mobile/login

# بعد از لاگین، به این redirect می‌شود:
foodinja://auth?code=XXXXXX

# Code را کپی کنید و با curl تست کنید:
curl -X POST https://foodinja.ir/api/exchange-code \
  -H "Content-Type: application/json" \
  -d '{"code": "PASTE_CODE_HERE"}'
```

### 2. تست Authorization Code

```bash
# تست با code نامعتبر
curl -X POST https://foodinja.ir/api/exchange-code \
  -H "Content-Type: application/json" \
  -d '{"code": "invalid_code"}'

# Expected: 401 Unauthorized
```

### 3. تست Code Expiration

```bash
# منتظر بمانید 10 دقیقه، سپس code را استفاده کنید
# Expected: 401 - Authorization code expired
```

---

## ❌ خطاهای رایج

### 1. "redirect_uri_mismatch"

**علت**: Redirect URI در Google Console تنظیم نشده

**راه حل**:
- به Google Cloud Console بروید
- Redirect URI را دقیقاً مطابق backend اضافه کنید
- دقت کنید: `https` vs `http` و `/` در انتها

### 2. "Invalid authorization code format"

**علت**: Code کمتر از 10 کاراکتر است یا خالی است

**راه حل**:
- مطمئن شوید code از deep link به درستی extract شده
- چک کنید که code در request body ارسال شده

### 3. "Authorization code expired or invalid"

**علت**: Code منقضی شده یا قبلاً استفاده شده

**راه حل**:
- فرآیند login را دوباره انجام دهید
- مطمئن شوید از code فقط یکبار استفاده می‌کنید
- چک کنید Redis در حال اجرا است

### 4. Deep Link کار نمی‌کند

**علت**: Scheme در app.json تعریف نشده

**راه حل (React Native - app.json):**
```json
{
  "expo": {
    "scheme": "foodinja",
    "ios": {
      "bundleIdentifier": "com.yourcompany.foodinja"
    },
    "android": {
      "package": "com.yourcompany.foodinja"
    }
  }
}
```

**راه حل (Android - AndroidManifest.xml):**
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="foodinja" android:host="auth" />
</intent-filter>
```

**راه حل (iOS - Info.plist):**
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>foodinja</string>
    </array>
  </dict>
</array>
```

---

## 📝 Checklist پیاده‌سازی

### Backend:
- [ ] Google OAuth credentials تنظیم شده
- [ ] Redirect URIs در Google Console اضافه شده
- [ ] متغیرهای محیطی تنظیم شده
- [ ] Redis در حال اجرا است
- [ ] Endpoints تست شده‌اند

### Mobile App:
- [ ] Deep link scheme در app.json تعریف شده
- [ ] WebView نصب شده (`react-native-webview`)
- [ ] Deep link listener اضافه شده
- [ ] WebView navigation intercept پیاده‌سازی شده
- [ ] Token storage پیاده‌سازی شده
- [ ] Error handling اضافه شده

---

## 🔄 Refresh Token Flow

برای تمدید access token:

**Endpoint:** `POST /api/auth/refresh`

**Request:**
```json
{
  "refresh_token": "YOUR_REFRESH_TOKEN"
}
```

**Response:**
```json
{
  "access_token": "NEW_ACCESS_TOKEN"
}
```

---

## 📞 پشتیبانی

برای سوالات یا مشکلات:
- بررسی logs در `/logs/app.log`
- چک کردن Redis: `redis-cli ping`
- بررسی Google OAuth logs در Google Cloud Console

---

**نسخه:** 1.0  
**تاریخ:** 2026  
**وضعیت:** آماده برای Production
