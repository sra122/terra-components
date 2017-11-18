import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {
    DataURLOptions,
    Fabric,
    FabricCanvas,
    FabricEvent,
    FabricImage
} from '../data/fabric/fabric.interface';
import { TerraEditableImageProperties } from '../data/editable-image-properties.interface';
import { isArray } from 'util';
import { EditableImage } from '../data/editable-image.class';
import { EditableImageOptions } from '../data/editable-image-options.interface';
import { EditableImageTransformation } from '../data/editable-image-transformation.interface';
import { EditableImageHistory } from '../data/editable-image-history.class';

@Component({
    selector: 'terra-editable-image',
    template: require('./terra-editable-image.component.html'),
    styles: [require('./terra-editable-image.component.scss')]
})
export class TerraEditableImageComponent implements OnChanges, AfterViewInit, DoCheck
{
    @Input()
    public inputSource:string = "";

    @Input()
    public inputZoom: number;

    @Input()
    public inputConfig: EditableImageOptions;

    @Output()
    public outputReadyState: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public inputZoomChange: EventEmitter<number> = new EventEmitter();

    @ViewChild('imageCanvas', {read: ElementRef})
    private _originalCanvas: ElementRef;

    private editableImage: EditableImage;

    public get canBeUndone(): boolean
    {
        return this.editableImage.history.canBeUndone;
    }

    public get canBeRedone(): boolean
    {
        return this.editableImage.history.canBeRedone;
    }

    constructor( private _hostElement: ElementRef )
    {
    }

    public ngAfterViewInit():void
    {
        this.initialize();

    }

    public ngOnChanges(changes:SimpleChanges):void
    {
        if ( changes.hasOwnProperty("inputSource") && this.inputSource )
        {
            this.initialize();
        }

        if ( changes.hasOwnProperty("inputZoom") && this.editableImage )
        {
            this.editableImage.setZoom( this.inputZoom / 100 );
        }
    }

    private initialize()
    {
        if ( this._originalCanvas && this.inputSource && !this.editableImage )
        {
            this.editableImage = new EditableImage(
                <HTMLCanvasElement> this._originalCanvas.nativeElement,
                this.inputSource,
                this.inputConfig
            );

            this.editableImage.readyState.subscribe(
                (readyState:boolean) => {
                    this.outputReadyState.emit( readyState );

                    this.resetZoom();
                }
            );

            this.editableImage.zoom.subscribe(
                (zoom:number) => {
                    zoom = Math.round( zoom * 100 );
                    if ( zoom !== this.inputZoom )
                    {
                        this.inputZoom = zoom;
                        this.inputZoomChange.emit( zoom );
                    }
                }
            );
        }
    }

    public ngDoCheck():void
    {
        this.calculateCanvasSize();
    }

    public resetZoom():void
    {
        if ( this.editableImage )
        {
            this.calculateCanvasSize();
            this.editableImage.setZoom(1);
        }
    }

    public applyTransformation( transformation: EditableImageTransformation ):void
    {
        if ( this.editableImage )
        {
            this.editableImage.applyTransformation( transformation );
        }
    }

    public undoTransformation():void
    {
        if ( this.editableImage )
        {
            this.editableImage.undoTransformation();
        }
    }

    public redoTransformation():void
    {
        if ( this.editableImage )
        {
            this.editableImage.redoTransformation();
        }
    }

    private calculateCanvasSize()
    {
        if ( this._hostElement && this.editableImage  )
        {
            let size:ClientRect = this._hostElement.nativeElement.getBoundingClientRect();
            this.editableImage.resizeCanvas( size.width, size.height );
        }
    }
}