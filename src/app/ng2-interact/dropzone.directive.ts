import { Directive, ElementRef, Input, OnChanges, EventEmitter, Output, SimpleChanges } from "@angular/core";
import * as Interact from "interactjs";
import { DropEvent } from "./dropEvent.interface";

export type AcceptFn = ( args: {
    interactEvent: Interact.InteractEvent,
    event: MouseEvent,
    isDropable: boolean,
    dropzone: Interact.Interactable,
    dropzoneElement: HTMLElement,
    draggable: Interact.Interactable,
    draggableElement: HTMLElement,
    dragData: any
}) => boolean

@Directive({
    selector: '[ia-dropzone]'
})
export class InteractDropzoneDirective implements OnChanges
{
    @Input('ia-dropzone-accept')
    public accept: AcceptFn | string = "";

    @Input('ia-dropzone-overlap')
    public overlap: 'pointer' | 'center' | number = 'pointer';

    @Input('ia-dropzone-disabled')
    public disabled: boolean = false;

    @Output('ia-dropzone-onDropActivate')
    public onDropActivate: EventEmitter<DropEvent> = new EventEmitter<DropEvent>();

    @Output('ia-dropzone-onDropDeactivate')
    public onDropDeactivate: EventEmitter<DropEvent> = new EventEmitter<DropEvent>();

    @Output('ia-dropzone-onDragEnter')
    public onDragEnter: EventEmitter<DropEvent> = new EventEmitter<DropEvent>();

    @Output('ia-dropzone-onDragLeave')
    public onDragLeave: EventEmitter<DropEvent> = new EventEmitter<DropEvent>();

    @Output('ia-dropzone-onDropMove')
    public onDropMove: EventEmitter<DropEvent> = new EventEmitter<DropEvent>();

    @Output('ia-dropzone-onDrop')
    public onDrop: EventEmitter<DropEvent> = new EventEmitter<DropEvent>();

    private interactable: Interact.Interactable = null;

    constructor( private el: ElementRef )
    {
        this.init();
    }

    public ngOnChanges( changes: SimpleChanges ): void
    {
        this.init();
    }

    private init(): void
    {
        let createDropEvent = ( event: DropEvent ) => {
            event.dropData = (<any>event.relatedTarget).IA_DRAG_DATA;
            return event;
        };

        let config: any = {
            enabled: !this.disabled,
            ondropactivate: (event: DropEvent) => {
                this.onDropActivate.emit(
                    createDropEvent( event )
                );
            },
            ondropdeactivate: (event: DropEvent) => {
                this.onDropDeactivate.emit(
                    createDropEvent( event )
                );
            },
            ondragenter: (event: DropEvent) => {
                this.onDragEnter.emit(
                    createDropEvent( event )
                );
            },
            ondragleave: (event: DropEvent) => {
                this.onDragLeave.emit(
                    createDropEvent( event )
                );
            },
            ondropmove: (event: DropEvent) => {
                this.onDropMove.emit(
                    createDropEvent( event )
                );
            },
            ondrop: (event: DropEvent) => {
                this.onDrop.emit(
                    createDropEvent( event )
                );
            }

        };

        if ( typeof this.overlap === "string"
            && parseFloat( this.overlap ) >= 0
            && parseFloat( this.overlap ) <= 1 )
        {
            config.overlap = parseFloat( this.overlap );
        }
        else
        {
            config.overlap = this.overlap;
        }

        if ( typeof this.accept === "string" && this.accept.length > 0 )
        {
            config.accept = this.accept;
        }
        else if ( this.accept instanceof Function )
        {
            config.checker = (
                interactEvent: Interact.InteractEvent,
                event: MouseEvent,
                isDropable: boolean,
                dropzone: Interact.Interactable,
                dropElement: HTMLElement,
                draggable: Interact.Interactable,
                dragElement: HTMLElement

            ) => {
                if ( isDropable )
                {
                    return (this.accept as AcceptFn) ({
                        interactEvent: interactEvent,
                        event: event,
                        isDropable: isDropable,
                        dropzone: dropzone,
                        dropzoneElement: dropElement,
                        draggable: draggable,
                        draggableElement: dragElement,
                        dragData: interactEvent.target.IA_DRAG_DATA
                    });
                }

                return false;
            };
        }

        if ( !this.interactable )
        {
            this.interactable = Interact( this.el.nativeElement );
        }
        this.interactable.dropzone( config );
    }

}