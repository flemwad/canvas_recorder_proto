
import { Injectable } from '@angular/core';
import { File as IonicFile } from '@ionic-native/file';

import { UtilsService } from './utils.service'

@Injectable()
export class VideoPlaybackService {
    _shouldReload: boolean;
 
    constructor(
        private file: IonicFile, 
        private utilsService: UtilsService
    ) { }

    setShouldReload() {
        this._shouldReload = true;
    }

    getShouldReload() {
        return this._shouldReload;
    }

    //Does this belong here? Maybe move it to another service?
    saveBlobDataToDevice(fileName: string, blobUrl: string): Promise<any> {
        return this.utilsService.downloadBlobFromBlobUrl(blobUrl).then((theBlob) => {
            return new Promise((resolve, reject) => {
                //TODO: Save to camera roll instead of Download
                const dir = 'Download/';
                return this.file.writeFile(this.file.externalRootDirectory + dir, fileName, theBlob, { replace: true })
                    .then(() => {
                        resolve(dir);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        });
    }

    saveBlobDataToServer() {
        //TODO
    }

}