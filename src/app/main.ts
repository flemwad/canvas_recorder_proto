import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';


function bootstrap() {
    platformBrowserDynamic().bootstrapModule(AppModule);
}

if (window['cordova']) {
    document.addEventListener('deviceready', () => bootstrap());
} else {
    bootstrap();
}