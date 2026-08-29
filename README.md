<div align="center">

# 🤖 Dastyar 🤖

**Your personalized AI assistant — smart conversations, full history, and a custom AI personality; all in one mobile app.**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.11-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| **💬 AI Chat** | Smooth conversations with typing animations, auto-scroll, and visually distinct message bubbles for user and AI |
| **📚 Conversation History** | Save, view, search, and delete past conversations — all from within the side Drawer |
| **🎨 AI Personalization** | Choose response tone (formal, friendly, educational, …), food preferences, favorite ingredients, and cooking time |
| **🔐 Authentication** | Secure token storage with Expo Secure Store; session is restored automatically on app restart |
| **👤 Guest Mode** | Use the app without signing up, with rate limiting based on Device ID, IP, and session |
| **🌙 Dark / Light Mode** | Full dark/light theming with CSS custom properties — no flash on load |
| **🔤 Vazir Font** | Beautiful Persian-optimised Vazir typeface, bundled locally — no network request needed |
| **📱 Cross-Platform** | Runs on Android, iOS, and Web from a single shared codebase |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81.5 · Expo 54 |
| Routing | Expo Router 6 — file-based |
| State Management | Redux Toolkit 2.11 · RTK Query |
| Styling | NativeWind 4.2 (Tailwind CSS for React Native) |
| Animations | Moti 0.30 · React Native Reanimated 4.1 |
| Navigation | React Navigation 7 (Drawer + Stack + Bottom Tabs) |
| Storage | AsyncStorage (conversations) · Expo Secure Store (tokens) |
| Type System | TypeScript 5.9 — strict mode |
| Font | Vazir Medium — self-hosted via `@font-face` |
| Components | `@gorhom/bottom-sheet` · Expo Vector Icons |

---

## 📁 Project Structure

```
dastyar/
├── app/                          # Expo Router screens (file-based routing)
│   ├── _layout.tsx              # Root: Redux Provider, theme, auth rehydration
│   ├── auth/
│   │   └── login.tsx            # Login / onboarding screen
│   └── (drawer)/
│       ├── _layout.tsx          # Drawer navigation layout
│       ├── index.tsx            # Main chat screen (new conversation)
│       ├── chat/
│       │   └── [chatId].tsx     # Saved conversation view
│       └── setting/
│           ├── index.tsx        # Settings dashboard
│           ├── personalization.tsx  # AI personalization
│           ├── dataContorol.tsx  # Data management
│           └── about.tsx
├── components/
│   ├── DrawerContent.tsx        # Custom drawer: chat list, search, user profile
│   └── ui/
│       ├── Button.tsx           # Animated button with icon support
│       ├── Input.tsx            # Text input with validation & icons
│       ├── BottomSheet.tsx      # Modal sheet wrapper
│       ├── Checkbox.tsx
│       ├── RaidoButton.tsx
│       └── ScrollDatePicker.tsx
├── redux/
│   ├── store.ts                 # Redux store configuration
│   ├── authSlice.ts             # Auth state (tokens, user profile)
│   ├── proxy.ts                 # Mock RTK Query base for offline dev
│   └── service/app.ts           # 19 RTK Query endpoints (chat, conversations, personalization)
├── utils/
│   ├── mockDatabase.ts          # Local database via AsyncStorage
│   ├── mockAI.ts                # Keyword-based AI response generator
│   ├── secureStorage.ts         # Expo Secure Store wrapper
│   └── deviceId.ts              # Device identification
├── hooks/
│   ├── use-color-scheme.ts      # Dark/light mode detection
│   ├── useGuestChat.ts          # Guest chat logic with rate limiting
│   └── usePersonalization.ts
├── constants/
│   └── theme.ts                 # Color palette, fonts, background images
├── types/
│   ├── api.ts                   # API request/response types
│   └── ui.ts                    # UI component types
└── assets/
    ├── font/Vazir-Medium.ttf    # Bundled Vazir font
    └── images/                  # Icons, splash, theme backgrounds
```

---

## 🚀 Installation

No build step required — the app runs directly from source.

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/Nima-Mohammadkhani/dastyar.git
   cd dastyar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dev server:**
   ```bash
   npx expo start
   ```

4. Run on your target platform:
   - **Android:** `npx expo run:android`
   - **iOS:** `npx expo run:ios`
   - **Web:** `npx expo start --web`

> **Tip:** Install the **Expo Go** app on your phone and scan the QR code from the terminal to run instantly on a physical device.

---

## ⚙️ Configuration

### Authentication

Login is name-based. Access and refresh tokens are stored in Expo Secure Store and automatically restored on app restart.

### AI Personalization

From **Settings → Personalization** you can:
- Select response tone (formal, friendly, concise, educational, humorous)
- Set food type preferences, favorite ingredients, and preferred cooking time

### Data Management

From **Settings → Data Control** you can wipe all local conversations and app data.

---

## 🔬 How It Works

```
app/_layout.tsx (Root)
       │
       ├── Redux Provider ──▶ store.ts
       │                           ├── authSlice  (tokens, user profile)
       │                           └── RTK Query  (proxy.ts — mock API)
       │
       ├── Auth Gate ──▶ app/auth/login.tsx
       │
       └── (drawer)/_layout.tsx
               ├── DrawerContent.tsx
               │       └── conversation list · search · user profile
               │
               ├── index.tsx  (new chat)
               │       ├── send message → RTK Query → proxy.ts
               │       ├── persist messages in mockDatabase (AsyncStorage)
               │       └── typing animation (Moti)
               │
               └── chat/[chatId].tsx  (saved conversation)
                       └── load from mockDatabase by ID
```

**Mock-First Architecture:** All API calls are routed through `redux/proxy.ts`, which intercepts RTK Query requests and returns mock responses — no internet connection required for development.

**Local-First Data:** Conversations and messages are persisted in AsyncStorage so they survive offline and app restarts. Only auth tokens go into Secure Store.

**Flash-free theming:** System theme detection and the user's saved preference are both applied synchronously before the browser paints a single frame.

---

## 📝 Important Notes

- **Fully offline** — all data lives on the device; no external server is required.
- **Mock AI** — responses are generated by `utils/mockAI.ts` based on keywords. To connect a real AI API, update `redux/proxy.ts`.
- **Vazir font** — bundled locally; zero network requests for typography.
- **Conversation sync** — data is currently device-local only; cross-device sync requires a backend.
- **Full RTL** — the UI is built for Persian with complete right-to-left layout support.

---

## 📄 License

MIT © [Nima Mohammadkhani](https://github.com/Nima-Mohammadkhani)
