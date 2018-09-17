import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { VideoCapComponent } from './videoCap.component';
import { DoubleTapDirective } from '../directives/elDoubleTap.directive';

@NgModule({
    imports: [IonicModule.forRoot(VideoCapComponent)],
    declarations: [VideoCapComponent, DoubleTapDirective],
    bootstrap: [VideoCapComponent]
})

export class VideoCapModule { }