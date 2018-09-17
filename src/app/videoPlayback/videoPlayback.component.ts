import { DOCUMENT } from '@angular/common';

import { 
    Component, 
    ViewChild, 
    ElementRef, 
    AfterContentInit
} from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastController  } from 'ionic-angular';
import { Router } from '@angular/router';

import { VideoPlaybackService } from '../services/videoPlayback.service';
import { VideoBlobService } from '../services/videoBlob.service';

@Component({
    selector: 'video-playback',
    templateUrl: './videoPlayback.html'
})

export class VideoPlaybackComponent implements AfterContentInit {
    @ViewChild('playbackVidDiv') playbackVidDiv: ElementRef;

    _playing: boolean;
    _vidInnerHtml: SafeResourceUrl = '';

    constructor(
        private videoPlaybackService: VideoPlaybackService,
        private videoBlobService: VideoBlobService,
        private sanitizer: DomSanitizer,
        private toastCtrl: ToastController,
        private router: Router,
    ) { }

    ngAfterContentInit(): void {
        this.appendPlaybackHtml();
    }

    appendPlaybackHtml() {
        const blobData = this.videoBlobService.getBlobData();
        if (!blobData) return;
        
        this._vidInnerHtml = this.sanitizer.bypassSecurityTrustHtml(
            `<video #playbackVid id='playbackVid' autoplay>
                <source src='${blobData.blobUrl}' /> No HTML5 supported
            </video>`
        );
    }

    //Should fire efter the vid el is appended to the innerHtml
    vidDivDomChange(event) {
        //TODO: Maybe figure out why this is firing early? don't really care though, this works
        if (!this._vidInnerHtml) return;
        var self = this;
        
        let playbackVid: HTMLVideoElement = <HTMLVideoElement>document.getElementById('playbackVid')

        playbackVid.onplay = function(e) {
            self._playing = true;
        }

        playbackVid.onended = function(e) {
            self._playing = false;
        }
        
        //TODO: Some progress bar/timer if we have time
        //playbackVid.onseeking = function(e) { }
    }

    acceptVid() {
        //TODO: Upload to server for twitter format conversion & cload storage upload
        this.videoPlaybackService.saveBlobDataToDevice('testyy.webm', '').then((savePath) => {
            this.toastCtrl.create({
                message: 'Video successfully saved to ' + savePath,
                duration: 3000,
                position: 'bottom'
            }).present();
        })
        .catch(() => {
            //TODO: Toast that failed to DL
            this.toastCtrl.create({ message: 'Video failed to download!' }).present();
        });
    }

    //This fucks up the canvas camera if it's executed too many times...
    //Something I think to do with window['plugins'] in the lib we're using...
    redoVid() {
        //Ugh, this burned like 3 hours
        this.videoBlobService.clearBlobData();
        
        //HACK: Tells the video cap to reload itself to fix bad plugin issue
        //We'll lose all service values doing this and state, and it's not true to SPA's
        this.videoPlaybackService.setShouldReload();

        this.router.navigateByUrl('/video-cap');
    }
}
