# 📚 API Documentation - FoodAI Backend

**نسخه**: 1.0.0  
**آخرین آپدیت**: 2026-02-05  
**Base URL**: `https://foodinja.ir/api`

---

## 📑 فهرست

1. [معلومات عمومی](#معلومات-عمومی)
2. [احراز هویت](#احراز-هویت)
3. [کاربر](#کاربر)
4. [چت و مکالمات](#چت-و-مکالمات)
5. [مدیریت توکن](#مدیریت-توکن)
6. [کدهای وضعیت HTTP](#کدهای-وضعیت-http)
7. [مثال‌های استفاده](#مثال‌های-استفاده)

---

## 🔧 معلومات عمومی

### Header های ضروری

تمام درخواست‌های محافظت‌شده نیاز به header زیر دارند:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Response Format

تمام response ها به صورت JSON برگردانده می‌شوند:

```json
{
  "statusCode": 200,
  "message": "پیام توضیحی",
  "data": { /* داده‌های اختیاری */ }
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "توضیح خطا"
}
```

---

## 🔐 احراز هویت

### 1. ورود (Login)

```
GET /api/users/login
```

**توضیح**: شروع فرآیند ورود با Google OAuth

**پاسخ**: تغییر مسیر به صفحه ورود Google

---

### 2. بازخورد OAuth (Callback)

```
GET /api/users/auth
```

**توضیح**: بازخورت OAuth از گوگل (داخلی)

**Query Parameters**:
- `code`: کد احراز هویت از Google
- `state`: state token

**پاسخ موفق** (تغییر مسیر به):
```
{frontend_url}/oauth2/redirect?access_token={token}&refresh_token={refresh}&token_type=bearer
```

---

### 3. تجدید توکن (Refresh Token)

```
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your_refresh_token_here"
}
```

**پاسخ موفق (200)**:
```json
{
  "access_token": "new_access_token_here"
}
```

**پاسخ ناموفق (401)**:
```json
{
  "statusCode": 401,
  "message": "refresh token مطابقه نارا"
}
```

---

### 4. اطلاعات کاربر فعلی

```
GET /api/auth/me
Authorization: Bearer <access_token>
```

**پاسخ موفق (200)**:
```json
{
  "user": {
    "sub": "1",
    "roles": [2]
  }
}
```

---

## 👤 کاربر

### 1. دریافت اطلاعات کاربر

```
GET /api/users/info
Authorization: Bearer <access_token>
```

**پاسخ موفق (200)**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "نام کاربر",
  "role": 2,
  "token_limit": 5000,
  "token_used": 1250,
  "remaining_tokens": 3750
}
```

**خطاها**:
- `401`: کاربر احراز هویت نشده است
- `404`: کاربر یافت نشد

---

## 💬 چت و مکالمات

### 1. اطلاعات Endpoint چت

```
GET /api/chat/chat
```

**پاسخ**:
```json
{
  "message": "This is the Food AI Chat endpoint",
  "method": "POST",
  "required_auth": "Bearer token",
  "required_role": [2],
  "body": {
    "query": "سوال شما",
    "history": "آخر 7 پیام (اختیاری)"
  }
}
```

---

### 2. ارسال پیام چت

```
POST /api/chat/chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "query": "سلام، چطور پیتزا درست کنم؟",
  "conversation_id": null,
  "history": [
    {
      "role": "user",
      "content": "سلام"
    },
    {
      "role": "assistant",
      "content": "سلام! چطور می‌تونم کمکت کنم؟"
    }
  ]
}
```

**پاسخ موفق (200)**:
```json
{
  "response": "<p>پاسخ به صورت HTML</p>",
  "conversation_id": 123,
  "new_conversation": false
}
```

**خطاها**:
- `401`: کاربر احراز هویت نشده است
- `403`: سقف توکن تمام شده است
- `404`: کاربر یافت نشد

**پاسخ خطای توکن (403)**:
```json
{
  "statusCode": 403,
  "message": "شما به سقف محدودیت استفاده از توکن خود رسیده‌اید. توکن‌ها در 2026-02-05T10:00:00 بازنشانی خواهند شد."
}
```

---

### 3. دریافت لیست مکالمات

```
GET /api/chat/conversations
Authorization: Bearer <access_token>
```

**پاسخ موفق (200)**:
```json
{
  "conversations": [
    {
      "conversation_id": 123,
      "title": "سلام، چطور پیتزا درست کنم؟",
      "user_id": 1,
      "created_at": "2026-02-04T10:30:00",
      "updated_at": "2026-02-05T14:45:00"
    }
  ],
  "total_messages": 1
}
```

---

### 4. دریافت پیام‌های مکالمه

```
GET /api/chat/conversations/{conversationId}
Authorization: Bearer <access_token>
```

**پاسخ موفق (200)**:
```json
{
  "conversation_id": 123,
  "title": "سلام، چطور پیتزا درست کنم؟",
  "user_id": 1,
  "created_at": "2026-02-04T10:30:00",
  "updated_at": "2026-02-05T14:45:00",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "سلام، چطور پیتزا درست کنم؟",
      "created_at": "2026-02-04T10:30:00"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "برای درست کردن پیتزا...",
      "created_at": "2026-02-04T10:31:00"
    }
  ],
  "total_messages": 2
}
```

---

### 5. حذف مکالمه

```
DELETE /api/chat/conversations/{conversationId}
Authorization: Bearer <access_token>
```

**پاسخ موفق (200)**:
```json
{
  "conversation_id": 123,
  "title": "سلام، چطور پیتزا درست کنم؟",
  "deleted_at": "2026-02-05T15:00:00",
  "message": "مکالمه با موفقیت حذف شد"
}
```

**خطاها**:
- `401`: کاربر احراز هویت نشده است
- `404`: مکالمه یافت نشد

---

### 6. بازیابی مکالمه حذف‌شده

```
POST /api/chat/conversations/{conversationId}/restore
Authorization: Bearer <access_token>
```

**پاسخ موفق (200)**:
```json
{
  "conversation_id": 123,
  "title": "سلام، چطور پیتزا درست کنم؟",
  "message": "مکالمه با موفقیت بازیابی شد"
}
```

---

### 7. لیست مکالمات حذف‌شده

```
GET /api/chat/conversations/deleted/list
Authorization: Bearer <access_token>
```

**پاسخ موفق (200)**:
```json
{
  "conversations": [
    {
      "conversation_id": 123,
      "title": "مکالمه حذف شده",
      "user_id": 1,
      "created_at": "2026-02-04T10:30:00",
      "deleted_at": "2026-02-05T15:00:00"
    }
  ],
  "total": 1
}
```

---

## 🎫 مدیریت توکن

### 1. وضعیت توکن

```
GET /api/chat/tokens/status
Authorization: Bearer <access_token>
```

**پاسخ موفق (200)**:
```json
{
  "user_id": 1,
  "token_limit": 5000,
  "token_used": 1250,
  "remaining_tokens": 3750,
  "last_token_reset": "2026-02-04T10:30:00",
  "next_reset": "2026-02-05T10:30:00"
}
```

---

## 📊 کدهای وضعیت HTTP

| کد | معنی | توضیح |
|---|---|---|
| 200 | OK | درخواست موفق |
| 400 | Bad Request | داده‌های نامعتبر |
| 401 | Unauthorized | احراز هویت نشده یا توکن نامعتبر |
| 403 | Forbidden | سقف توکن تمام شده است |
| 404 | Not Found | منبع یافت نشد |
| 500 | Server Error | خطای سرور |

---

## 💡 مثال‌های استفاده

### مثال 1: دریافت اطلاعات کاربر

```bash
curl -X GET "https://foodinja.ir/api/users/info" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json"
```

```javascript
// JavaScript/Fetch
const response = await fetch('https://foodinja.ir/api/users/info', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);
```

---

### مثال 2: ارسال پیام چت

```bash
curl -X POST "https://foodinja.ir/api/chat/chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "query": "چطور کیک بسازم؟",
    "conversation_id": null,
    "history": []
  }'
```

```javascript
const response = await fetch('https://foodinja.ir/api/chat/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'چطور کیک بسازم؟',
    conversation_id: null,
    history: []
  })
});
const data = await response.json();
console.log(data.response);
```

---

### مثال 3: دریافت لیست مکالمات

```bash
curl -X GET "https://foodinja.ir/api/chat/conversations" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json"
```

```javascript
const response = await fetch('https://foodinja.ir/api/chat/conversations', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
data.conversations.forEach(conv => {
  console.log(`${conv.conversation_id}: ${conv.title}`);
});
```

---

### مثال 4: حذف و بازیابی مکالمه

```javascript
// حذف مکالمه
const deleteResponse = await fetch(
  `https://foodinja.ir/api/chat/conversations/123`,
  {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }
);

// بازیابی مکالمه
const restoreResponse = await fetch(
  `https://foodinja.ir/api/chat/conversations/123/restore`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }
);
```

---

### مثال 5: تجدید توکن

```javascript
const refreshResponse = await fetch('https://foodinja.ir/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refresh_token: refreshToken
  })
});

const data = await refreshResponse.json();
const newAccessToken = data.access_token;
```

---

## 🔄 Workflow مثالی

### سناریو: یک کاربر نو

```
1. کاربر روی دکمه "ورود با گوگل" کلیک می‌کند
   ↓
2. GET /api/users/login
   ↓
3. تغییر مسیر به صفحه گوگل برای ورود
   ↓
4. کاربر اطلاعات خود را وارد می‌کند
   ↓
5. بازخورد به GET /api/users/auth
   ↓
6. تغییر مسیر به {frontend}/oauth2/redirect?access_token=...
   ↓
7. Frontend تایید می‌کند و توکن را ذخیره می‌کند
   ↓
8. GET /api/users/info (برای اطلاعات کاربر)
   ↓
9. GET /api/chat/tokens/status (برای وضعیت توکن)
```

---

## ⚠️ نکات مهم

### خطای Timezone
تمام timestamp ها به صورت ISO 8601 و UTC هستند:
```
2026-02-05T15:30:00+00:00
```

### توکن Reset خودکار
توکن‌های کاربر به صورت خودکار هر 24 ساعت ریست می‌شوند:
- آخرین زمان ریست در `last_token_reset` ذخیره می‌شود
- زمان ریست بعدی در response محاسبه می‌شود

### محدود‌سازی توکن
- سقف پیش‌فرض توکن: **5000 توکن**
- برای افزایش سقف، می‌توانید نقش کاربر را تغییر دهید
- وقتی توکن تمام شود، خطای 403 دریافت می‌شود

### مکالمات حذف‌شده
- حذف‌ها "نرم" هستند (Soft Delete)
- می‌توانید مکالمات را بازیابی کنید
- مکالمات برای همیشه حذف نمی‌شوند

---

## 📞 پشتیبانی

برای سوالات و مشکلات:
- 📧 Email: support@foodai.com
- 🐛 Report bugs: [GitHub Issues](https://github.com/foodai)

---

**آخرین بروزرسانی**: 2026-02-05
