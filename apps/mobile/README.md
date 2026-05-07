#*Things to do to launch the APP in ur setup*

## 1. Change ip address to run the app
src/services/apiService.js & AuthContext.js
line 8 http://xxx.xxx.xxx.xxx:3000/api
replace x with ur ip address

## 2. bypass the usual checks and proceed with the installation
npm install --legacy-peer-deps

## 3. Start the app
prefer using npx expo start --clear --tunnel
```bash
npx expo start

### Additional:
--tunnel 
==> tunnel in case u using different network

--clear
==> resets metro bundler/fixes sync issues/clear cache