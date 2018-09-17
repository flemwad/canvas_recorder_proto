
import { Injectable } from '@angular/core';

@Injectable()
export class VideoBlobService {
    _blobData: { blob: Blob, blobUrl: string } = null;

    setBlobData(blobData) {
        this._blobData = blobData;
        return this._blobData;
    }

    getBlobData() {
        return this._blobData;
    }

    clearBlobData() {
        this._blobData = null;
    }

}