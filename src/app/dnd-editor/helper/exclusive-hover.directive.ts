import {
    Directive,
    ElementRef,
    Input,
    OnInit
} from '@angular/core';

/**
 * Add CSS class while hovering exactly this element but not a child element having this directive too.
 */
@Directive({
    selector: '[exclusive-hover]'
})
export class ExclusiveHoverDirective implements OnInit
{
    private static CURRENT_ELEMENT: HTMLElement;
    private static LAST_MOUSE_EVENT: MouseEvent;

    // The CSS-class to assign on hover
    @Input('exclusive-hover')
    public hoverClass: string = "hover";


    constructor( private _element: ElementRef )
    {
    }

    public ngOnInit():void
    {
        this._element.nativeElement.onmousemove = ( event: MouseEvent ) => {

            // check if event has already been handled.
            // store event globally to avoid preventing default or stopping propagation
            if ( ExclusiveHoverDirective.LAST_MOUSE_EVENT !== event )
            {
                ExclusiveHoverDirective.LAST_MOUSE_EVENT = event;
                if ( ExclusiveHoverDirective.CURRENT_ELEMENT )
                {
                    ExclusiveHoverDirective.CURRENT_ELEMENT.classList.remove( this.hoverClass );
                }

                ExclusiveHoverDirective.CURRENT_ELEMENT = this._element.nativeElement;
                ExclusiveHoverDirective.CURRENT_ELEMENT.classList.add( this.hoverClass );
            }
        };

        this._element.nativeElement.onmouseleave = ( event: MouseEvent ) => {
            if ( ExclusiveHoverDirective.CURRENT_ELEMENT === this._element.nativeElement )
            {
                this._element.nativeElement.classList.remove( this.hoverClass );
                ExclusiveHoverDirective.CURRENT_ELEMENT = null;
            }
        };
    }
}