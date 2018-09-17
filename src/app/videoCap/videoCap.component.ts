import { 
    Component, 
    ViewChild, 
    ElementRef, 
    AfterContentInit, 
    NgZone 
} from '@angular/core';

import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { VideoBlobService } from '../services/videoBlob.service';
import { VideoPlaybackService } from '../services/videoPlayback.service';
import { RecordRTCService } from './recordRTC.service';
import { PermissionsService } from './permissions.service';
import { PromiseCanvasCamera } from './canvasCamera.service';

@Component({
    selector: 'video-cap',
    templateUrl: './videoCap.html',
    providers: [
        PermissionsService, 
        RecordRTCService, 
        PromiseCanvasCamera,
    ]
})

export class VideoCapComponent implements AfterContentInit {
    @ViewChild('canvasEl') canvasEl: ElementRef;
    // @ViewChild('overlayImg') overlayImg: ElementRef;

    _playing: boolean;
    _vidInnerHtml: SafeResourceUrl;

    constructor(
        private canvasCamera: PromiseCanvasCamera,
        private videoBlobService: VideoBlobService,
        private recordRTCService: RecordRTCService,
        private permissionsService: PermissionsService,
        private videoPlaybackService: VideoPlaybackService,
        private router: Router,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        //HACK: If we don't reload the app, window cordova plugin gets wonky and memory leaks
        //I hate this but burned too much time getting it to work
        if (this.videoPlaybackService.getShouldReload()) location.reload();
    }

    ngAfterContentInit(): void {
        //Clean up the services on fresh visit
        this.permissionsService.requestPerms().then(this.permissionsAccepted.bind(this));
    }

    permissionsAccepted(accepted) {
        this.ngZone.run(() => {
            const canvasEl = (this.canvasEl.nativeElement as HTMLCanvasElement);

            this.canvasCamera.initialize(canvasEl, null);

            //TODO: Pass camera options from here, and implement callbacks
            this.canvasCamera.start(null, (onStartData) => { })
        })
    }

    startRecording() {
        if (!this._playing) {
            this._playing = true;

            const canvasEl = (this.canvasEl.nativeElement as HTMLCanvasElement);

            //Set up a service to actually capture the canvas and audio
            this.recordRTCService.initialize(canvasEl).then(() => {
                //We'll pass stopVid as the callback so we can stop the recorder after 30s
                return this.recordRTCService.startRecording().then((success) => {
                    //Timer expired, stop the vid
                    this.stopVid();
                });
            });
        }
    }

    stopVid() {
        this.canvasCamera.stop((data) => {
            //Router never fires without ngZone.run ... 
            //Dunno how to avoid this, but it's like $scope.$digest all over again
            this.recordRTCService.stopRecording().then((blobData) => this.ngZone.run(() => {
                this._playing = false;

                this.videoBlobService.setBlobData(blobData);

                this.router.navigateByUrl('/video-playback');
            }));
        });
    }

    onCanvasDblTap(event) {
        this.stopVid();
    }

}
