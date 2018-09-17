import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

@Component({
    template: '<router-outlet></router-outlet>'
})

export class App {
    constructor(platform: Platform) {
        platform.ready().then(() => {});
    }
}

