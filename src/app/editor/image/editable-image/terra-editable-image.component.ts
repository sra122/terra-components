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

// use require instead of import to allow using .js-file
require('../../../assets/scripts/fabric');
declare const fabric: Fabric;

@Component({
    selector: 'terra-editable-image',
    template: require('./terra-editable-image.component.html'),
    styles: [require('./terra-editable-image.component.scss')]
})
export class TerraEditableImageComponent implements OnChanges, AfterViewInit, DoCheck
{
    @Input()
    public inputSource:string = "";

    private _zoom:number;

    @Input()
    public set inputZoom(value:number)
    {
        if ( this._zoom !== value )
        {
            this._zoom = value;
            if ( this._canvas )
            {
                this._canvas.zoomToPoint(
                    new fabric.Point(this._canvas.width / 2, this._canvas.height / 2),
                    this._zoom / 100
                );
                if ( this._image )
                {
                    this._canvas.viewportCenterObject(this._image);
                }
                this._canvas.renderAll();
            }
        }
    }

    public get inputZoom():number
    {
        return this._zoom;
    }

    @Input()
    public inputControlColor: string = "#24B3E0";

    @Input()
    public inputBackgroundColor: string = "#F3F3F3";

    @Input()
    public inputSpacing: number | [number,number] = 50;

    @Input()
    public inputImageProperties: TerraEditableImageProperties;

    @Output()
    public inputZoomChange: EventEmitter<number> = new EventEmitter();

    @Output()
    public inputImagePropertiesChange:EventEmitter<TerraEditableImageProperties> = new EventEmitter();

    @ViewChild('imageCanvas', {read: ElementRef})
    private _originalCanvas: ElementRef;

    private _canvas: FabricCanvas;

    private _image: FabricImage;

    private _isEditable: boolean = false;

    constructor( private _hostElement: ElementRef )
    {

    }

    public ngAfterViewInit():void
    {
        this._canvas = new fabric.Canvas(
            this._originalCanvas.nativeElement,
            {
                backgroundColor: this.inputBackgroundColor
            }
        );

        if ( this.inputSource )
        {
            this.loadImage();
        }
        this.calculateCanvasSize();

    }

    public ngOnChanges(changes:SimpleChanges):void
    {
        if ( changes.hasOwnProperty("inputSource") && this.inputSource )
        {
            this.loadImage();
        }
    }

    public ngDoCheck():void
    {
        this.calculateCanvasSize();
        if ( this.hasImagePropertiesChanged() )
        {
            this.applyImageProperties();
        }
    }

    public autoZoom():void
    {
        let isRotated:boolean = Math.abs(this._image.angle) % 180 === 90;
        let imageWidth:number = isRotated ? this._image.getScaledHeight() : this._image.getScaledWidth();
        let imageHeight:number = isRotated ? this._image.getScaledWidth() : this._image.getScaledHeight();
        let zoomWidth: number =  (this._canvas.width - this.getSpacing(false)) / imageWidth;
        let zoomHeight: number = (this._canvas.height - this.getSpacing(true))/ imageHeight;
        this.inputZoom = Math.min( zoomWidth, zoomHeight ) * 100;
        this.inputZoomChange.emit( this.inputZoom );
    }

    public startScaling()
    {
        this._isEditable = true;
        this._canvas.setActiveObject( this._image );
        this.applyImageProperties();
    }

    public stopScaling()
    {
        this._isEditable = false;
        this._canvas.discardActiveObject();
        this.applyImageProperties();
    }

    public rotateBy( angle: number )
    {
        if ( this._image )
        {
            this._image.angle = this._image.angle + angle;
        }
        this.applyImageProperties();
    }

    public getImageData( options: DataURLOptions ):string
    {
        return this._image.toDataURL(options);
    }

    private loadImage( url?: string )
    {
        if ( url )
        {
            this.inputSource = url;
        }

        if ( this._canvas )
        {
            if ( this._image )
            {
                this._canvas.clear();
            }

            fabric.Image.fromURL(
                this.inputSource,
                (image: FabricImage) => {
                    this._image = image;
                    this._image.on('deselected', (e: FabricEvent) => {
                        // do not allow deselecting image
                        this._canvas.setActiveObject( this._image );
                    });
                    let onChangeCallback = this.emitImageProperties.bind(this);
                    this._image.on({
                        'scaling': onChangeCallback,
                        'rotating': onChangeCallback
                    });
                    this._canvas.add( this._image );

                    // calculate initial zoom
                    this.autoZoom();
                    this.applyImageProperties();
                    this.emitImageProperties();
                },
                {
                    lockRotation: true,
                    lockScalingFlip: true,
                    lockScalingX: false,
                    lockScalingY: false,
                    lockUniScaling: false,
                    hasRotatingPoint: false,
                    borderColor:this.inputControlColor,
                    cornerStyle:"circle",
                    cornerSize:10,
                    cornerColor: this.inputControlColor,
                    transparentCorners: false,
                    selectable:this._isEditable,
                }
            );
        }
    }

    private calculateCanvasSize()
    {
        if ( this._hostElement )
        {
            let size:ClientRect = this._hostElement.nativeElement.getBoundingClientRect();
            if ( this._canvas && (this._canvas.width !== size.width || this._canvas.height !== size.height) )
            {
                this._canvas.setWidth( size.width );
                this._canvas.setHeight( size.height );
                if ( this._image )
                {
                    this._canvas.viewportCenterObject( this._image );
                }

            }
        }
    }

    private getSpacing( vertical: boolean ): number
    {
        if ( isArray( this.inputSpacing ) )
        {
            return vertical ? this.inputSpacing[0] : this.inputSpacing[1];
        }
        else
        {
            return this.inputSpacing;
        }
    }

    private hasImagePropertiesChanged():boolean
    {
        return !this.inputImageProperties
               || !this._image
               || this.inputImageProperties.width !== this._image.getScaledWidth()
               || this.inputImageProperties.height !== this._image.getScaledHeight()
               || this.inputImageProperties.angle !== this._image.angle
    }

    private applyImageProperties()
    {
        if ( this._image )
        {
            if ( this.inputImageProperties )
            {
                //this._image.scaleToWidth( this.inputImageProperties.width, true );
                //this._image.scaleToHeight( this.inputImageProperties.height, true );
                this._image.scaleX = this.inputImageProperties.width / this._image.getOriginalSize().width;
                this._image.scaleY = this.inputImageProperties.height / this._image.getOriginalSize().height;
                this._image.angle = this.inputImageProperties.angle;
            }
            //this._image.selectable = this._isEditable;
            this._canvas.renderAll();
            this._canvas.viewportCenterObject( this._image );
            this.emitImageProperties();
        }
    }

    private emitImageProperties()
    {
        if ( this._image )
        {
            this.inputImagePropertiesChange.emit({
                width: this._image.getScaledWidth(),
                height: this._image.getScaledHeight(),
                angle: this._image.angle
            });
        }
        else
        {
            this.inputImagePropertiesChange.emit(null);
        }
    }
}