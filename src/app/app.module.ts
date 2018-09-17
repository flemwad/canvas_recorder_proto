import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { File } from '@ionic-native/file';
import { Media } from '@ionic-native/media';

import { AppRoutingModule, CustomReuseStrategy } from './app.routes';
import { VideoCapModule } from './videoCap/videoCap.module';
import { VideoPlaybackModule } from './videoPlayback/videoPlayback.module';

import { App } from './app.component';

import { VideoPlaybackService } from './services/videoPlayback.service';
import { VideoBlobService } from './services/videoBlob.service';
import { UtilsService } from './services/utils.service';

@NgModule({
    declarations: [
        App
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(App),
        AppRoutingModule,
        VideoCapModule,
        VideoPlaybackModule,
        RouterModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        App,
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
        AndroidPermissions,
        VideoPlaybackService,
        VideoBlobService,
        UtilsService,
        File,
        Media
    ]
})

export class AppModule { }

