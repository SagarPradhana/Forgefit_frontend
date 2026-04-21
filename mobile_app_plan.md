# ForgeFit Mobile App Transition Plan (React Native)

This document outlines the strategic roadmap and technical architecture for expanding the **ForgeFit Gym Management System** into a native mobile application for iOS and Android.

## 1. Vision & Objectives
*   **Native Experience**: Transition the "Hyper-Glass" web aesthetic into a fluid, 60fps mobile interface.
*   **Member Retention**: Enhance user engagement through push notifications and personalized workout tracking.
*   **Operational Efficiency**: Streamline gym attendance via QR/Barcode scanning.
*   **Unified Backend**: Leverage existing API infrastructure to ensure data parity across Web and Mobile.

---

## 2. Technical Stack (Proposed)
| Category | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | React Native (Expo) | Faster development, easy OTA updates, and excellent hardware access. |
| **Styling** | NativeWind (Tailwind OSS) | Consistency with existing web CSS/Tailwind patterns. |
| **State Management** | Zustand | Already used in the web project; simple and lightweight. |
| **Navigation** | React Navigation | The industry standard for flexible, native-feeling navigation. |
| **Data Fetching** | TanStack Query (React Query) | Robust caching and offline synchronization. |
| **Persistence** | MMKV / AsyncStorage | Permanent local storage for user sessions and offline data. |
| **Charts** | Victory Native / Gifted Charts | Native-optimized replacements for Recharts. |

---

## 3. Core Feature Modules

### 👤 User Portal (Member App)
*   **Dashboard**: High-density summary of active plan, next workout, and today's attendance status.
*   **QR Digital ID**: Dynamic QR code generation for touchless entry at the gym.
*   **Workout Logger**: Interactive "Mark as Done" lists for training programs.
*   **Push Notifications**: Reminders for expiring subscriptions, new offers, and gym announcements.
*   **Payment Integration**: Native Apple Pay / Google Pay for subscription renewals.

### 👑 Admin Portal (Manager App)
*   **Real-time Attendance**: Live feed of members currently in the facility.
*   **Member Management**: One-tap status toggling (Active/Suspended) and document viewing.
*   **Analytics Overview**: Simplified mobile charts for daily revenue and check-ins.
*   **Broadcast Notifications**: Send push alerts to specific member segments directly from the phone.

### 🌐 Public Portal (Lead Generation)
*   **Plan Exploration**: Mobile-optimized pricing grid with "Join Now" native flow.
*   **Virtual Tour**: Interactive gallery of gym facilities and equipment.

---

## 4. Mobile-Specific Enhancements
1.  **Biometric Login**: Support for FaceID/TouchID for instant, secure access.
2.  **Native Calendar Sync**: Add group class schedules directly to the device's default calendar.
3.  **Offline First**: Ability to view workout plans and membership status without an active internet connection.
4.  **HealthKit / Google Fit**: (Future Phase) Sync workout data and calories burned with mobile health ecosystems.

---

## 5. Development Phases

### Phase 1: Foundation (Weeks 1-2)
*   Initialize Expo project with TypeScript.
*   Configure **NativeWind** and design system tokens (Colors, Typography).
*   Implement Shared Authentication (Login/Register) synced with web API.

### Phase 2: User Experience (Weeks 3-5)
*   Build the main Tab Navigation (Dashboard, Workout, Profile).
*   Implement the **Digital Member ID** (QR).
*   Connect Subscription and Payment flows.

### Phase 3: Admin & Notifications (Weeks 6-8)
*   Build the Admin Dashboard and Member Management lists.
*   Integrate **Expo Notifications** for push alert system.
*   implement QR Scanner for admin-side arrival confirmation.

### Phase 4: Polish & Deploy (Weeks 9-10)
*   Perform UX/UI hardening (Animations, Transitions).
*   Beta testing via TestFlight (iOS) and Play Console (Android).
*   Production Release.

---

## 6. Architecture Mapping (Web to Mobile)
*   **api/** -> Shared between projects.
*   **store/** -> Copy and adapt `useAuthStore` and `useGymStore` (change `localStorage` to `AsyncStorage`).
*   **components/** -> Rewrite components for React Native primitives (`View` instead of `div`, `Text` instead of `p`).
*   **assets/** -> Migrate SVG icons and brand assets.

---

> [!TIP]
> **Key Strategy**: Do not try to port the web code directly. Use the **Logic** (State/API) but rebuild the **Layout** using React Navigation for a true native experience.
