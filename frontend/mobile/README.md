# Mobile Application (React Native + Expo)

This is the mobile application for the Digital Park Guide Training Platform developed for Sarawak Forestry Corporation.

## Purpose
The mobile application allows park guides to access training content anytime and anywhere, supporting flexible learning and real-time field usage.

## Features
- User authentication (secure login)
- Access to training modules (videos, quizzes, materials)
- Progress tracking and certification management
- Notifications and alerts from admin
- Integration with IoT-based abnormal activity detection system
- Secure data handling and access control

## Tech Stack
- React Native (Expo)
- JavaScript / TypeScript

## Change ip address to run the app
src/services/apiService.js
line 8 http://xxx.xxx.xxx.xxx:3000/api
replace x with ur ip address

## Run the app
npx expo start --tunnel --clear
tunnel: different network
clear: clear cache, fix stale data, restart server

## Running the App
```bash
npm install
npx expo start

