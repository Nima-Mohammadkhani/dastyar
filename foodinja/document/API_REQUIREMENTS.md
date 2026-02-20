# مستندات API های مورد نیاز اپلیکیشن Foodinja

این فایل شامل تمام API هایی است که اپلیکیشن موبایل Foodinja نیاز دارد. این API ها بر اساس بررسی کد و شناسایی مکان‌هایی که از mock data استفاده شده، تهیه شده است.

**Base URL:** `https://foodinja.ir/api/`

**Authentication:** تمام درخواست‌ها (به جز login و refresh token) نیاز به Header زیر دارند:
```
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
```

---

## 1. Authentication APIs

### 1.1. Google OAuth Login
**Endpoint:** `POST /users/login`

**Description:** ورود با استفاده از Google OAuth. این endpoint کاربر را به صفحه Google OAuth هدایت می‌کند و پس از تایید، به redirect_uri مشخص شده با access_token و refresh_token برمی‌گرداند.

**Query Parameters:**
- `redirect_uri` (string, required): آدرس redirect پس از احراز هویت موفق
  - مثال: `foodinja://oauth2/redirect`

**Response (Redirect URL):**
```
{redirect_uri}?access_token={access_token}&refresh_token={refresh_token}
```

**Example:**
```
POST /users/login?redirect_uri=foodinja://oauth2/redirect
```

**Error Responses:**
- `400 Bad Request`: درخواست نامعتبر
- `401 Unauthorized`: احراز هویت ناموفق
- `500 Internal Server Error`: خطای سرور

---

### 1.2. Refresh Access Token
**Endpoint:** `POST /auth/refresh`

**Description:** دریافت access token جدید با استفاده از refresh token

**Request Body:**
```json
{
  "refresh_token": "string"
}
```

**Response (Success - 200):**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "Bearer"
}
```

**Error Responses:**
- `400 Bad Request`: refresh token نامعتبر
- `401 Unauthorized`: refresh token منقضی شده یا نامعتبر
- `500 Internal Server Error`: خطای سرور

---

### 1.3. Get Current User (Basic Info)
**Endpoint:** `GET /auth/me`

**Description:** دریافت اطلاعات پایه کاربر فعلی

**Response (Success - 200):**
```json
{
  "user": {
    "sub": "string",
    "roles": [1, 2]
  }
}
```

**Error Responses:**
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `500 Internal Server Error`: خطای سرور

---

## 2. User APIs

### 2.1. Get User Info (Detailed)
**Endpoint:** `GET /users/info`

**Description:** دریافت اطلاعات کامل کاربر

**Response (Success - 200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "نام کاربر",
  "role": 1,
  "token_limit": 10000,
  "token_used": 5000,
  "remaining_tokens": 5000
}
```

**Error Responses:**
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `500 Internal Server Error`: خطای سرور

---

### 2.2. Update User Profile
**Endpoint:** `PUT /users/profile`

**Description:** بروزرسانی اطلاعات پروفایل کاربر (نام، ایمیل)

**Request Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response (Success - 200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "نام کاربر",
  "role": 1,
  "token_limit": 10000,
  "token_used": 5000,
  "remaining_tokens": 5000
}
```

**Error Responses:**
- `400 Bad Request`: داده‌های نامعتبر
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `500 Internal Server Error`: خطای سرور

---

## 3. Chat APIs

### 3.1. Send Chat Message
**Endpoint:** `POST /chat/chat`

**Description:** ارسال پیام چت و دریافت پاسخ از AI

**Request Body:**
```json
{
  "query": "string",
  "conversation_id": 123,
  "history": [
    {
      "role": "user",
      "content": "پیام کاربر"
    },
    {
      "role": "assistant",
      "content": "پاسخ AI"
    }
  ]
}
```

**Request Fields:**
- `query` (string, required): پیام کاربر
- `conversation_id` (number, optional): شناسه مکالمه (برای ادامه مکالمه موجود)
- `history` (array, optional): تاریخچه پیام‌های قبلی
  - `role` (string): "user" یا "assistant"
  - `content` (string): محتوای پیام

**Response (Success - 200):**
```json
{
  "response": "پاسخ AI به صورت HTML",
  "conversation_id": 123,
  "new_conversation": false
}
```

**Error Responses:**
- `400 Bad Request`: درخواست نامعتبر
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `403 Forbidden`: دسترسی غیرمجاز
- `429 Too Many Requests`: محدودیت استفاده از توکن
- `500 Internal Server Error`: خطای سرور

---

## 4. Conversation Management APIs

### 4.1. Get All Conversations
**Endpoint:** `GET /chat/conversations`

**Description:** دریافت لیست تمام مکالمات کاربر

**Response (Success - 200):**
```json
{
  "conversations": [
    {
      "conversation_id": 1,
      "title": "عنوان مکالمه",
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total_messages": 50
}
```

**Error Responses:**
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `500 Internal Server Error`: خطای سرور

---

### 4.2. Get Conversation by ID
**Endpoint:** `GET /chat/conversations/{conversation_id}`

**Description:** دریافت جزئیات یک مکالمه شامل تمام پیام‌ها

**Path Parameters:**
- `conversation_id` (number, required): شناسه مکالمه

**Response (Success - 200):**
```json
{
  "conversation_id": 1,
  "title": "عنوان مکالمه",
  "user_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "پیام کاربر",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "پاسخ AI",
      "created_at": "2024-01-01T00:01:00Z"
    }
  ],
  "total_messages": 2
}
```

**Error Responses:**
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `404 Not Found`: مکالمه یافت نشد
- `500 Internal Server Error`: خطای سرور

---

### 4.3. Delete Conversation
**Endpoint:** `DELETE /chat/conversations/{conversation_id}`

**Description:** حذف یک مکالمه (soft delete)

**Path Parameters:**
- `conversation_id` (number, required): شناسه مکالمه

**Response (Success - 200):**
```json
{
  "conversation_id": 1,
  "title": "عنوان مکالمه",
  "deleted_at": "2024-01-01T00:00:00Z",
  "message": "مکالمه با موفقیت حذف شد"
}
```

**Error Responses:**
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `404 Not Found`: مکالمه یافت نشد
- `500 Internal Server Error`: خطای سرور

---

### 4.4. Restore Conversation
**Endpoint:** `POST /chat/conversations/{conversation_id}/restore`

**Description:** بازیابی یک مکالمه حذف شده

**Path Parameters:**
- `conversation_id` (number, required): شناسه مکالمه

**Response (Success - 200):**
```json
{
  "conversation_id": 1,
  "title": "عنوان مکالمه",
  "message": "مکالمه با موفقیت بازیابی شد"
}
```

**Error Responses:**
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `404 Not Found`: مکالمه یافت نشد
- `500 Internal Server Error`: خطای سرور

---

### 4.5. Get Deleted Conversations
**Endpoint:** `GET /chat/conversations/deleted/list`

**Description:** دریافت لیست مکالمات حذف شده

**Response (Success - 200):**
```json
{
  "conversations": [
    {
      "conversation_id": 1,
      "title": "عنوان مکالمه",
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
```

**Error Responses:**
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `500 Internal Server Error`: خطای سرور

---

## 5. Personalization APIs

### 5.1. Get User Personalization Settings
**Endpoint:** `GET /users/personalization`

**Description:** دریافت تنظیمات شخصی‌سازی کاربر

**Response (Success - 200):**
```json
{
  "tone": "صمیمی",
  "food_types": ["غذای اصلی", "دسر"],
  "available_ingredients": ["برنج", "مرغ", "گوجه"],
  "favorite_dishes": ["قورمه سبزی", "زرشک پلو با مرغ"],
  "cooking_time": 30
}
```

**Response Fields:**
- `tone` (string): سبک و لحن پایه (مثلاً: "صمیمی", "رسمی", "خلاق", "ساده و سریع")
- `food_types` (array): انواع غذاهای مورد علاقه
- `available_ingredients` (array): مواد اولیه در دسترس کاربر
- `favorite_dishes` (array): غذاهای مورد علاقه کاربر
- `cooking_time` (number): زمان آشپزی به دقیقه

**Error Responses:**
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `404 Not Found`: تنظیمات شخصی‌سازی یافت نشد (می‌تواند null برگرداند)
- `500 Internal Server Error`: خطای سرور

---

### 5.2. Update User Personalization Settings
**Endpoint:** `PUT /users/personalization`

**Description:** بروزرسانی تنظیمات شخصی‌سازی کاربر

**Request Body:**
```json
{
  "tone": "صمیمی",
  "food_types": ["غذای اصلی", "دسر"],
  "available_ingredients": ["برنج", "مرغ", "گوجه"],
  "favorite_dishes": ["قورمه سبزی", "زرشک پلو با مرغ"],
  "cooking_time": 30
}
```

**Request Fields:**
- `tone` (string, optional): سبک و لحن پایه
- `food_types` (array, optional): انواع غذاهای مورد علاقه
- `available_ingredients` (array, optional): مواد اولیه در دسترس
- `favorite_dishes` (array, optional): غذاهای مورد علاقه
- `cooking_time` (number, optional): زمان آشپزی به دقیقه

**Response (Success - 200):**
```json
{
  "tone": "صمیمی",
  "food_types": ["غذای اصلی", "دسر"],
  "available_ingredients": ["برنج", "مرغ", "گوجه"],
  "favorite_dishes": ["قورمه سبزی", "زرشک پلو با مرغ"],
  "cooking_time": 30,
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: داده‌های نامعتبر
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `500 Internal Server Error`: خطای سرور

---

## 6. Reference Data APIs

### 6.1. Get Available Ingredients List
**Endpoint:** `GET /reference/ingredients`

**Description:** دریافت لیست تمام مواد اولیه موجود در سیستم

**Response (Success - 200):**
```json
{
  "ingredients": [
    "گوشت قرمز",
    "مرغ",
    "ماهی",
    "تخم‌مرغ",
    "برنج",
    "ماکارونی",
    "سیب‌زمینی",
    "گوجه",
    "خیار",
    "پیاز",
    "سیر",
    "هویج",
    "کدو",
    "بادمجان",
    "فلفل دلمه‌ای",
    "قارچ",
    "لبنیات",
    "پنیر",
    "ماست",
    "کره",
    "روغن",
    "آرد",
    "شکر",
    "نمک",
    "فلفل",
    "زردچوبه",
    "دارچین",
    "زعفران",
    "رب گوجه",
    "سس گوجه",
    "سس مایونز",
    "خیارشور",
    "زیتون",
    "گردو",
    "بادام",
    "کشمش",
    "خرما",
    "عسل",
    "شکلات",
    "پودر کاکائو",
    "وانیل",
    "خامه",
    "ژلاتین"
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: خطای سرور

---

### 6.2. Get Available Dishes List
**Endpoint:** `GET /reference/dishes`

**Description:** دریافت لیست تمام غذاهای موجود در سیستم

**Response (Success - 200):**
```json
{
  "dishes": [
    "قورمه سبزی",
    "فسنجان",
    "زرشک پلو با مرغ",
    "ته چین",
    "لوبیا پلو",
    "عدس پلو",
    "سبزی پلو با ماهی",
    "کشک بادمجان",
    "میرزا قاسمی",
    "بورانی",
    "کوفته تبریزی",
    "دلمه برگ مو",
    "کباب کوبیده",
    "جوجه کباب",
    "چلو گوشت",
    "آبگوشت",
    "کله جوش",
    "شیرین پلو",
    "آلبالو پلو",
    "مرصع پلو"
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: خطای سرور

---

### 6.3. Get Available Food Types
**Endpoint:** `GET /reference/food-types`

**Description:** دریافت لیست انواع غذاهای موجود

**Response (Success - 200):**
```json
{
  "food_types": [
    "غذای اصلی",
    "دسر",
    "شیرینی",
    "نوشیدنی",
    "پیش‌غذا",
    "سوپ"
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: خطای سرور

---

### 6.4. Get Available Tones
**Endpoint:** `GET /reference/tones`

**Description:** دریافت لیست لحن‌های موجود برای شخصی‌سازی

**Response (Success - 200):**
```json
{
  "tones": [
    "صمیمی",
    "رسمی",
    "خلاق",
    "ساده و سریع"
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: خطای سرور

---

## 7. Token Management APIs

### 7.1. Get Token Status
**Endpoint:** `GET /chat/tokens/status`

**Description:** دریافت وضعیت توکن کاربر (محدودیت، استفاده شده، باقی‌مانده)

**Response (Success - 200):**
```json
{
  "user_id": 1,
  "token_limit": 10000,
  "token_used": 5000,
  "remaining_tokens": 5000,
  "last_token_reset": "2024-01-01T00:00:00Z",
  "next_reset": "2024-02-01T00:00:00Z"
}
```

**Error Responses:**
- `401 Unauthorized`: توکن نامعتبر یا منقضی شده
- `500 Internal Server Error`: خطای سرور

---

## 8. Error Handling

### Error Response Format
تمام خطاها به صورت زیر برگردانده می‌شوند:

```json
{
  "statusCode": 400,
  "message": "پیام خطا"
}
```

### HTTP Status Codes
- `200 OK`: درخواست موفق
- `400 Bad Request`: درخواست نامعتبر
- `401 Unauthorized`: احراز هویت ناموفق یا توکن نامعتبر
- `403 Forbidden`: دسترسی غیرمجاز
- `404 Not Found`: منبع یافت نشد
- `429 Too Many Requests`: محدودیت استفاده از توکن
- `500 Internal Server Error`: خطای سرور

---

## 9. Notes

### Authentication Flow
1. کاربر با Google OAuth وارد می‌شود
2. سرور `access_token` و `refresh_token` را برمی‌گرداند
3. اپلیکیشن `access_token` را در header تمام درخواست‌ها ارسال می‌کند
4. در صورت منقضی شدن `access_token` (401), اپلیکیشن به صورت خودکار با `refresh_token` یک `access_token` جدید دریافت می‌کند

### Token Refresh
- اپلیکیشن به صورت خودکار token را refresh می‌کند
- در صورت نامعتبر بودن refresh token، کاربر باید دوباره وارد شود

### Conversation Management
- حذف مکالمه به صورت soft delete است (قابل بازیابی)
- مکالمات حذف شده در endpoint جداگانه قابل مشاهده هستند

### Personalization
- تنظیمات شخصی‌سازی باید در پروفایل کاربر ذخیره شود
- این تنظیمات در هنگام ارسال پیام به AI استفاده می‌شوند
- لیست مواد اولیه و غذاها باید از API دریافت شود (نه hardcoded)

### Date Format
- تمام تاریخ‌ها به صورت ISO 8601 (UTC) برگردانده می‌شوند
- مثال: `2024-01-01T00:00:00Z`

### Response Content
- پاسخ‌های AI ممکن است شامل HTML باشند
- اپلیکیشن باید قابلیت نمایش HTML را داشته باشد

---

## 10. Summary of Required APIs

### APIs که باید پیاده‌سازی شوند:

1. ✅ `POST /users/login` - Google OAuth Login
2. ✅ `POST /auth/refresh` - Refresh Token
3. ✅ `GET /auth/me` - Get Current User
4. ✅ `GET /users/info` - Get User Info
5. ⚠️ `PUT /users/profile` - Update User Profile (نیاز دارد)
6. ✅ `POST /chat/chat` - Send Chat Message
7. ✅ `GET /chat/conversations` - Get All Conversations
8. ✅ `GET /chat/conversations/{id}` - Get Conversation by ID
9. ✅ `DELETE /chat/conversations/{id}` - Delete Conversation
10. ✅ `POST /chat/conversations/{id}/restore` - Restore Conversation
11. ✅ `GET /chat/conversations/deleted/list` - Get Deleted Conversations
12. ⚠️ `GET /users/personalization` - Get Personalization Settings (نیاز دارد)
13. ⚠️ `PUT /users/personalization` - Update Personalization Settings (نیاز دارد)
14. ⚠️ `GET /reference/ingredients` - Get Ingredients List (نیاز دارد)
15. ⚠️ `GET /reference/dishes` - Get Dishes List (نیاز دارد)
16. ⚠️ `GET /reference/food-types` - Get Food Types (نیاز دارد)
17. ⚠️ `GET /reference/tones` - Get Tones (نیاز دارد)
18. ✅ `GET /chat/tokens/status` - Get Token Status

**توضیح:**
- ✅ = API هایی که قبلاً پیاده‌سازی شده‌اند
- ⚠️ = API هایی که نیاز به پیاده‌سازی دارند (بر اساس mock data در کد)

---

**تاریخ آخرین بروزرسانی:** 2024

**نسخه:** 1.0.0
