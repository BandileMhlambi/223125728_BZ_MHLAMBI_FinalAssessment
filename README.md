# Hotel Booking App (React Native + Expo)

Beginner-friendly mobile app that covers Section A (UI + Navigation) and Section B (Firebase + APIs).

## What’s included
- Onboarding (3 screens) shown once for new accounts
- Auth: Sign Up, Sign In, Forgot Password (Firebase Auth)
- Explore → Hotel Details → Booking → Success
- Reviews with add review (Firestore realtime)
- Profile tab (name, email, live bookings, logout)
- Deals tab (Fake Store API)
- Weather on details (OpenWeather API)

## Folder overview
- `App.js`: wraps providers and navigation
- `src/context/`: `AuthContext.js`, `BookingContext.js`
- `src/navigation/`: `RootNavigator.js` (Auth stack, Onboarding stack, App tabs)
- `src/firebase/`: `firebase.js` (Auth + Firestore init)
- `src/screens/`: Auth, Onboarding, and App screens
- `Materials/`: your provided images (already referenced in code)

## Prerequisites
- Node 18+ recommended
- Expo Go on your phone
- A Firebase project with Email/Password enabled
- An OpenWeather API key (free tier is fine)

## Environment variables
Create a file named `.env` in the project root. Expo exposes variables prefixed with `EXPO_PUBLIC_` at runtime.

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional (recommended for weather on Hotel Details)
EXPO_PUBLIC_OPENWEATHER_KEY=your_openweather_api_key
```

Notes:
- If you don’t add the Firebase envs, the app will use the inline keys that are already set in `src/firebase/firebase.js` (your current project keys), so it still works.
- Add the weather key to show live temperature on the Hotel Details screen.

## Setup (no code changes required)
1) Put your `.env` file next to `package.json`.
2) Ensure `Materials/` exists inside the project (you already pasted it). The code references files like `Materials/01-Onboarding Page/Onboarding 1.png` and `Materials/06-Explore Page/image-1.png`.
3) Install dependencies if needed (they may already be installed):
   - `npx expo install` (or `npm install`)
4) Start the project:
   - `npx expo start`
   - Scan the QR with Expo Go.

## Feature test checklist
- Sign Up → onboarding appears once → Explore tab.
- Explore → pick a hotel → Details shows average rating and, if key added, weather.
- Add Review → modal opens → submit → review appears instantly (Firestore realtime).
- Book Now → enter dates (YYYY-MM-DD) and rooms → Confirm → Success → booking saved.
- Profile → name editable (updates Firestore), bookings list shows latest.
- Deals tab → shows cards from Fake Store API.
- Logout → returns to Sign In

## Data model (Firestore)
- `users/{uid}`: `{ uid, name, email }`
- `users/{uid}/bookings/{bookingId}`: `{ hotelId, hotelName, checkIn, checkOut, nights, rooms, rate, total }`
  `hotels/{hotelId}/reviews/{reviewId}`: `{ author, stars, text, createdAt }`

## Common issues
- If images don’t show, verify file paths in `Materials/` match the ones in code.
- If weather doesn’t show, ensure `EXPO_PUBLIC_OPENWEATHER_KEY` is set and you restarted Expo.
- If Firebase auth fails, check your Firebase project has Email/Password enabled.

## Credits
- UI assets: your provided Materials folder.
- APIs: Firebase, Fake Store API, OpenWeather.


