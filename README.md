HTML5 Video capture of native Camera played through a Canvas with an overlay

Double tap the recording to stop, ends at 30sec.

Replays the video taken, can Redo or Accept will download to default storage container on device

Currently there is a bug with one of the plugins (cordova-plugin-canvascamera or VideoRecordRTC) in Angular 5 so I reload the app on "Redo" :(
Also Android Only because of lack of support for WebRTC in Safari

dev:
```
npm install
ionic cordova run android
```