import { TerraDraggableDirective } from './draggable.directive';
import InteractEvent = Interact.InteractEvent;

export type DraggableFactoryCallback = (event: InteractEvent) => void;
export type DraggableFactoryEvent = "*" | "start" | "move" | "end";

export interface DraggableFactoryOptions
{
    cloneClass?: string;
}

export class DraggableFactory
{
    private _dragClone: HTMLElement;
    private _dragPosition: {x: number, y: number} = { x: 0, y: 0 };

    private _callbacks: {[eventName: string]: Array<DraggableFactoryCallback>} = {
        "*": [],
        start: [],
        move: [],
        end: []
    };

    constructor(
        private _draggableElement: TerraDraggableDirective,
        private _options: DraggableFactoryOptions = {}
    )
    {
        _draggableElement.onStart.subscribe( this.onStart.bind(this) );
        _draggableElement.onMove.subscribe( this.onMove.bind(this) );
        _draggableElement.onEnd.subscribe( this.onEnd.bind(this) );
    }

    public get dragActive(): boolean
    {
        return !!this._dragClone;
    }

    public on( event: DraggableFactoryEvent, callback: DraggableFactoryCallback ): DraggableFactory
    {
        this._callbacks[event].push( callback );
        return this;
    }

    public emit( event: DraggableFactoryEvent, dragEvent: InteractEvent )
    {
        this._callbacks[event].forEach( (callback: DraggableFactoryCallback) => {
            callback( dragEvent );
        });

        this._callbacks["*"].forEach( (callback: DraggableFactoryCallback) => {
            callback( dragEvent );
        });
    }

    private onStart( event: InteractEvent )
    {
        if ( this._dragClone )
        {
            console.warn( "Drag already in progress." );
            return;
        }

        this.initClone( event.target );
        this.emit( "start", event );
    }

    private onMove( event: InteractEvent )
    {
        this.moveCloneBy( event.dx, event.dy );
        this.emit( "move", event );
    }

    private onEnd( event: InteractEvent )
    {
        this.destoryClone();
        this.emit( "end", event );
    }

    private initClone( original: HTMLElement )
    {
        let rect: ClientRect = original.getBoundingClientRect();
        this._dragClone = <HTMLElement> original.cloneNode( true );
        this._dragClone.style.width = rect.width + "px";
        this._dragClone.style.height = rect.height + "px";
        this._dragClone.style.pointerEvents = "none";
        this._dragClone.classList.add( this._options.cloneClass || "draggable-clone" );
        this.moveClone( rect.left, rect.top );
        document.body.appendChild( this._dragClone );
    }

    private moveClone( x: number, y: number )
    {
        this._dragPosition = {
            x: x,
            y: y
        };

        if ( this._dragClone )
        {
            this._dragClone.style.left = x + "px";
            this._dragClone.style.top = y + "px";
        }
    }

    private moveCloneBy( dx: number, dy: number )
    {
        this.moveClone(
            this._dragPosition.x + dx,
            this._dragPosition.y + dy
        );
    }

    private destoryClone()
    {
        if ( this._dragClone )
        {
            this._dragClone.remove();
            this._dragClone = null;
        }
    }
}