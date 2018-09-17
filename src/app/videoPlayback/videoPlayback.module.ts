import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { VideoPlaybackComponent } from './videoPlayback.component'
import { DomChangeDirective } from '../directives/domChange.directive';

@NgModule({
    imports: [IonicModule.forRoot(VideoPlaybackComponent)],
    declarations: [VideoPlaybackComponent, DomChangeDirective],
    bootstrap: [VideoPlaybackComponent]
})

export class VideoPlaybackModule { }