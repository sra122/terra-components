import { TerraDropzoneDirective } from './dropzone.directive';
import { DropEvent } from './dropEvent.interface';

export type DropzoneFactoryCallback = (event: DropEvent, index: number) => void;
export type DropzoneFactoryEvent = "*" | "reset" | "dragActivate" | "dragEnter" | "dragMove" | "dragLeave" | "dragDeactivate" | "drop"

export interface DropzoneFactoryOptions
{
    dropContainer?: HTMLElement;
    getPreviewElement?: (event: DropEvent) => HTMLElement;
}

export class DropzoneFactory
{
    public isDragActive: boolean = false;
    public isDragOver: boolean = false;

    private _container: HTMLElement;
    private _previewItem: HTMLElement;
    private _dragIndex: number = -1;

    private _callbacks: {[eventName: string]: Array<DropzoneFactoryCallback> } = {
        "*": [],
        dragActivate: [],
        dragEnter: [],
        dragMove: [],
        dragLeave: [],
        dragDeactivate: [],
        drop: [],
        reset: []
    };

    constructor(
        private _dropzoneElement: TerraDropzoneDirective,
        private _options: DropzoneFactoryOptions = {} )
    {
        this._container = this._options.dropContainer || this._dropzoneElement.el.nativeElement;

        _dropzoneElement.onDropActivate.subscribe( this.onDragActivate.bind(this) );
        _dropzoneElement.onDragEnter.subscribe( this.onDragEnter.bind(this) );
        _dropzoneElement.onDropMove.subscribe( this.onDragMove.bind(this) );
        _dropzoneElement.onDragLeave.subscribe( this.onDragLeave.bind(this) );
        _dropzoneElement.onDropDeactivate.subscribe( this.onDragDeactivate.bind(this) );
        _dropzoneElement.onDrop.subscribe( this.onDrop.bind(this) );
    }

    public on(event: DropzoneFactoryEvent, callback: DropzoneFactoryCallback ): DropzoneFactory
    {
        this._callbacks[event].push( callback );
        return this;
    }

    private emit(event: DropzoneFactoryEvent, dropEvent: DropEvent )
    {
        this._callbacks[event].forEach( (callback: DropzoneFactoryCallback) => {
            callback( dropEvent, this._dragIndex );
        });

        this._callbacks["*"].forEach( (callback: DropzoneFactoryCallback) => {
            callback( dropEvent, this._dragIndex );
        });
    }

    private onDragActivate( event: DropEvent )
    {
        this.isDragActive = true;
        this.emit( "dragActivate", event );
    }

    private onDragEnter( event: DropEvent )
    {
        this.isDragOver = true;
        this.emit( "dragEnter", event );
    }

    private onDragMove( event: DropEvent )
    {
        let x: number = event.dragEvent.clientX;
        let y: number = event.dragEvent.clientY;

        if ( !this._previewItem )
        {
            this._previewItem = this.getPreviewElement( event );
        }

        let sibling: HTMLElement = this.getElementAtPosition( x, y );

        if ( sibling && this.shouldInsertAfter( event.dragEvent, sibling ) )
        {
            sibling = this.nextElement( sibling );
        }

        if ( sibling !== this._previewItem )
        {
            this.insertPreviewElementBefore( sibling );
        }

        this._dragIndex = this.getDragIndex();
        this.emit( "dragMove", event );
    }

    private onDragLeave( event: DropEvent )
    {
        this._dragIndex = this.getDragIndex();
        this.reset( true );
        this.emit( "dragLeave", event );
    }

    private onDragDeactivate( event: DropEvent )
    {
        this._dragIndex = this.getDragIndex();
        this.reset( false );
        this.emit( "dragDeactivate", event );
    }

    private onDrop( event: DropEvent )
    {
        this._dragIndex = this.getDragIndex();
        this.reset( false );
        this.emit( "drop", event );
    }

    private reset( dragActive )
    {
        if ( this._previewItem )
        {
            this._previewItem.remove();
            this._previewItem = null;
        }
        this.isDragOver = false;
        this.isDragActive = dragActive;
        this.emit( "reset", null );
    }

    private getDragIndex()
    {
        if ( this._previewItem )
        {
            for( let i = 0; i < this._container.children.length; i++ )
            {
                if ( this._container.children[i] === this._previewItem )
                {
                    return i - 1;
                }
            }
        }

        return -1;
    }

    private getElementAtPosition( x, y ): HTMLElement
    {
        let element: HTMLElement = <HTMLElement> document.elementFromPoint( x, y );
        if ( this._container.contains( element ) )
        {
            while( element.parentElement && element.parentElement !== this._container )
            {
                element = element.parentElement;
            }
        }

        if ( !this._container.contains( element ) )
        {
            element = null;
        }

        return element;
    }

    private getPreviewElement( event: DropEvent ): HTMLElement
    {
        if ( this._options.getPreviewElement )
        {
            return this._options.getPreviewElement(event);
        }

        return <HTMLElement> event.relatedTarget.cloneNode(true);
    }

    private nextElement( element: HTMLElement ): HTMLElement
    {
        let sibling: Node = element.nextElementSibling;

        if ( !sibling )
        {
            sibling = element.nextSibling;
            while( sibling && sibling.nodeType !== Node.ELEMENT_NODE )
            {
                sibling = sibling.nextSibling;
            }
        }

        return <HTMLElement> sibling;
    }

    private shouldInsertAfter( event: Interact.InteractEvent, element: HTMLElement )
    {
        let isHorizontal: boolean = Math.abs( event.dx ) > Math.abs( event.dy );
        let position: {x: number, y: number} = this.getPositionInElement( event.clientX, event.clientY, element );

        return ( isHorizontal && position.x > 0.5 )
               || ( !isHorizontal && position.y > 0.5 );
    }

    private getPositionInElement( x: number, y: number, element: HTMLElement ): {x: number, y: number}
    {
        let posX: number = -1;
        let posY: number = -1;
        let rect: ClientRect = element.getBoundingClientRect();

        if ( x >= rect.left && x <= rect.right )
        {
            posX = (x - rect.left) / rect.width;
        }

        if ( y >= rect.top && y <= rect.bottom )
        {
            posY = (y - rect.top) / rect.height;
        }

        return {
            x: posX,
            y: posY
        };
    }

    private insertPreviewElementBefore( sibling = null )
    {
        if ( this._previewItem )
        {
            this._previewItem.remove();
        }

        this._container.insertBefore( this._previewItem, sibling );
    }
}