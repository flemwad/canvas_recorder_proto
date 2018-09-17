import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Injectable()
export class PermissionsService {
    _isiOS: boolean;
    _isAndroid: boolean;

    constructor(platform: Platform, private androidPermissions: AndroidPermissions) {
        this._isiOS = platform.is('ios');
        this._isAndroid = platform.is('android');
    }

    requestPerms(): Promise<any> {
        const permsPromise = this._isiOS ? this.requestiOS() : this.requestAndroid();
        return permsPromise;
    }

    requestiOS(): Promise<boolean> {
        var self = this;

        return new Promise ((resolve, reject) => {
            reject('Method not yet implemented!');
        });
    }

    requestAndroid(): Promise<boolean> {
        if (!this._isAndroid) return;

        return new Promise((resolve, reject) => {
            this.androidPermissions.requestPermissions(
                [
                    this.androidPermissions.PERMISSION.CAMERA,
                    this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
                    this.androidPermissions.PERMISSION.RECORD_AUDIO,
                    this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
                    this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
                ]
            )
            .then(() => {
                resolve(true);
            })
            .catch((err) => reject(err));
        })
    }

}