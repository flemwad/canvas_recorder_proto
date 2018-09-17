import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';
import { VideoCapComponent } from './videoCap/videoCap.component';
import { VideoPlaybackComponent } from './videoPlayback/videoPlayback.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/video-cap', pathMatch: 'full' },
    { path: 'video-cap', component: VideoCapComponent },
    { path: 'video-playback', component: VideoPlaybackComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule { };


//Add your route to routesToCache if you want the component to be remembered
//can't have that for video-cap and video-playback
export class CustomReuseStrategy implements RouteReuseStrategy {

    handlers: {[key: string]: DetachedRouteHandle} = {};
    routesToCache: string[] = [];

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        console.debug('CustomReuseStrategy:shouldDetach', route);
        return this.routesToCache.indexOf(route.routeConfig.path) > -1;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        console.debug('CustomReuseStrategy:store', route, handle);
        this.handlers[route.routeConfig.path] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        console.debug('CustomReuseStrategy:shouldAttach', route);
        return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        console.debug('CustomReuseStrategy:retrieve', route);
        if (!route.routeConfig) return null;
        return this.handlers[route.routeConfig.path];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        console.debug('CustomReuseStrategy:shouldReuseRoute', future, curr);
        return future.routeConfig === curr.routeConfig;
    }

}