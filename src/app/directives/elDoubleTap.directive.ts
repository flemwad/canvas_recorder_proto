import {
    Directive,
    AfterViewInit,
    OnDestroy,
    ElementRef,
    Output,
    EventEmitter
} from '@angular/core';

import { Gesture } from 'ionic-angular';

@Directive({
    selector: '[doubletap]'
})
export class DoubleTapDirective implements AfterViewInit, OnDestroy {
    private pressGesture: Gesture;

    // the actual element
    constructor(private el: ElementRef) { }

    public ngAfterViewInit(): void {
        this.pressGesture = new Gesture(this.el.nativeElement);

        this.pressGesture.listen();
        this.pressGesture.on('doubletap', (e: Event) => {
            this.ondoubletap.emit(e);
        });
    }

    // emit the `Event`, bind to (ondoubletap) in your markup
    @Output() public ondoubletap: EventEmitter<Event> = new EventEmitter();

    // clean things up
    public ngOnDestroy() {
        this.pressGesture.destroy();
    }
}
