import { Injectable, NgZone, OnDestroy } from '@angular/core';


@Injectable()
export class PromiseCanvasCamera implements CanvasCamera {
    // _overlay: HTMLImageElement;

    constructor(private ngZone: NgZone) { }

    initialize(fcanvas: HTMLCanvasElement, tcanvas: HTMLCanvasElement): void {
        //TODO: Is there a way not to use window.plugin here? It's probably the issue with flickering vid
        this.ngZone.run(() => {
            window['plugin'].CanvasCamera.initialize(fcanvas);
        });
    }
    
    createFrame(image: HTMLImageElement, element: HTMLCanvasElement): Frame {
        throw new Error('Method not implemented.');
    }    

    createRenderer(element: HTMLCanvasElement, parent: CanvasCamera): Renderer {
        throw new Error('Method not implemented.');
    }

    //TODO Params: 
    start(options: CanvasCameraOptions, onSuccess?: (data: any) => void, onError?: (error?: any) => void): void {
        this.ngZone.run(() => {
            window['plugin'].CanvasCamera.start({
                fps: 60,
                cameraFacing: 'front',
                onAfterDraw: function(frame) {
                    //TODO: Figure out how to combine an image with frame.element.getContext('2d')
                    let ctx = frame.element.getContext('2d');
    
                    ctx.font = '100px Comic Sans MS';
                    ctx.fillStyle = 'pink';
                    ctx.textAlign = 'bottom';
                    ctx.fillText('#I Promise', frame.element.width / 2, frame.element.height - 50);
    
                    //TODO If the overlay is an img:
                    //ctx.drawImage(self._overlay, 412, 600);
                },
            }, onError, onSuccess);
        });
    }

    stop(onSuccess?: (data: any) => void, onError?: (error?: any) => void, ): void {
        this.ngZone.run(() => {
            window['plugin'].CanvasCamera.stop(null, (stopData) => {
                return onSuccess(stopData);
            });
        });     
    }

    flashMode(flashMode: boolean, onError?: (error?: any) => void, onSuccess?: (data: any) => void): void {
        throw new Error('Method not implemented.');
    }

    cameraPosition(cameraFacing: 'front' | 'back', onError?: (error?: any) => void, onSuccess?: (data: any) => void): void {
        throw new Error('Method not implemented.');
    }

    capture(data: any): void {
        throw new Error('Method not implemented.');
    }

    enableRenderers(): void {
        throw new Error('Method not implemented.');
    }

    disableRenderers(): void {
        throw new Error('Method not implemented.');
    }

    setRenderingPresets(): CanvasCamera {
        throw new Error('Method not implemented.');
    }

    getUISize(): { width: number; height: number; } {
        throw new Error('Method not implemented.');
    }

    getUIOrientation(): 'portrait' | 'landscape' {
        throw new Error('Method not implemented.');
    }

    setRenderersSize(size: { width: number; height: number; }): CanvasCamera {
        throw new Error('Method not implemented.');
    }

}

// @Injectable()
// export class CanvasCameraService {
//     constructor(private canvasCamera: PromiseCanvasCamera) {}

//     getCanvasCamera() {
//         return this.canvasCamera;
//     }

//     cleanup() {
//         this.canvasCamera = null;
//     }
// }
