#*Things to do to launch the APP in ur setup*

## Change ip address to run the app
src/services/apiService.js
line 8 http://xxx.xxx.xxx.xxx:3000/api
replace x with ur ip address

## bypass the usual checks and proceed with the installation
npm install --legacy-peer-deps

## Start the app
``bash
npx expo start

### Additional:
--tunnel 
==> tunnel in case u using different network

--clear
==> resets metro bundler/fixes sync issues/clear cache
