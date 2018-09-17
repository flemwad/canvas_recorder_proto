import { Directive, Output, ElementRef, EventEmitter, OnDestroy } from '@angular/core';

@Directive({
    selector: '[domChange],[observeOpts]',
})
export class DomChangeDirective implements OnDestroy {
    private changes: MutationObserver;

    @Output()
    public domChange = new EventEmitter();

    constructor(private elementRef: ElementRef) {
        const element = this.elementRef.nativeElement;

        this.changes = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((mutation: MutationRecord) => this.domChange.emit(mutation));
        });

        //We're only gonna observe childList changes, but others can be used like attribute,
        //if we wanna make that a selector on this Directive
        this.changes.observe(element, {
            childList: true
        });
    }

    ngOnDestroy(): void {
        this.changes.disconnect();
    }
}