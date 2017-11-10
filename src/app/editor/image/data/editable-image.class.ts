import {
    Fabric,
    FabricCanvas,
    FabricImage
} from './fabric/fabric.interface';
import {
    EditableImageOptions,
    mergeDefaults
} from './editable-image-options.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EditableImageTransformation } from './editable-image-transformation.interface';
import { EditableImageHistory } from './editable-image-history.class';
import { isArray } from 'util';

require('../../../assets/scripts/fabric');
declare const fabric: Fabric;

export class EditableImage
{
    public readyState: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public zoom: BehaviorSubject<number> = new BehaviorSubject(0);

    private options: EditableImageOptions;

    private canvas: FabricCanvas;

    private originalImage: HTMLImageElement;

    private image: FabricImage;

    private isEditable: boolean;

    private history: EditableImageHistory;

    constructor( originalCanvas: HTMLCanvasElement, imageURL: string, options?: EditableImageOptions )
    {
        // apply default values for options
        this.options = mergeDefaults( options );

        // initialize fabric canvas
        this.canvas = new fabric.Canvas(
            originalCanvas,
            {
                backgroundColor: this.options.backgroundColor
            }
        );

        // create native HTML image
        this.originalImage = new Image();
        this.originalImage.crossOrigin = "anonymous";
        this.originalImage.onload = () => {
            // initialize fabric image
            this.image = this.initializeImage( this.originalImage );

            // setup history
            this.history = new EditableImageHistory(() => {
                return this.initializeImage(this.originalImage);
            });

            this.canvas.add( this.image );

            // emit ready state
            this.readyState.next(true);

            this.updateViewport();
        };
        this.originalImage.src = imageURL;
    }

    public setEditable( editable: boolean ): void
    {
        this.isEditable = editable;
        this.refresh();
    }

    public refresh( autoZoom: boolean = false ): void
    {
        let imageElement: HTMLImageElement = new Image();
        imageElement.onload = () => {
            this.canvas.remove( this.image );
            this.image = this.initializeImage( imageElement );
            this.canvas.add( this.image );

            this.updateViewport( autoZoom );
        };

        let zoom = this.canvas.getZoom();
        //this.setZoom(1);
        imageElement.src = this.image.toDataURL();
    }

    public applyTransformation( transformation: EditableImageTransformation ): void
    {
        if ( this.readyState.getValue() )
        {
            transformation.transform( this.image );
            this.history.push( transformation );
            this.refresh();
        }
    }

    public undoTransformation(): void
    {
        if ( this.readyState.getValue() && this.history.canBeUndone )
        {
            this.image = this.history.undo();
            this.refresh();
        }
    }

    public redoTransformation(): void
    {
        if ( this.readyState.getValue() && this.history.canBeRedone )
        {
            this.image = this.history.redo();
            this.refresh();
        }
    }

    public resizeCanvas( width: number, height: number ): void
    {
        if ( this.readyState.getValue() && ( width !== this.canvas.width || height !== this.canvas.height ) )
        {
            this.canvas.setDimensions(
                { width: width + 'px', height: height + 'px' },
                { cssOnly: true }
            );

            let vptWidth: number = this.image.width;
            let vptHeight: number = this.image.height;
            let ratioX: number = width / vptWidth;
            let ratioY: number = height / vptHeight;

            if( ratioX > ratioY )
            {
                vptHeight = vptWidth * ratioX;
            }
            else
            {
                vptWidth = vptHeight * ratioY;
            }

            console.log( vptWidth, vptHeight );
            this.canvas.setDimensions(
                { width: vptWidth, height :vptHeight },
                { backstoreOnly: true }
            );

            this.updateViewport();
        }
    }

    public setZoom( value: number )
    {
        if ( this.readyState.getValue() )
        {
            this.canvas.zoomToPoint(
                new fabric.Point(this.canvas.width / 2, this.canvas.height / 2),
                value
            );
            this.zoom.next( value );
            this.updateViewport();
        }
    }

    public updateViewport( autoZoom: boolean = false ): void
    {
        if ( this.readyState.getValue() )
        {
            if ( autoZoom )
            {
                let zoomWidth: number =  (this.canvas.width - this.getViewportSpacing(false)) / this.image.getScaledWidth();
                let zoomHeight: number = (this.canvas.height - this.getViewportSpacing(true)) / this.image.getScaledHeight();
                this.setZoom( Math.min( zoomWidth, zoomHeight ) );
            }

            this.canvas.viewportCenterObject( this.image );
            this.image.setCoords();
            this.canvas.renderAll();
        }
    }

    private initializeImage( sourceElement: HTMLImageElement ): FabricImage
    {
        return new fabric.Image(
            sourceElement,
            {
                lockRotation: true,
                lockScalingFlip: true,
                lockScalingX: !this.isEditable,
                lockScalingY: !this.isEditable,
                lockUniScaling: false,
                hasRotatingPoint: false,
                borderColor: this.options.controlColor,
                cornerStyle:"circle",
                cornerSize:10,
                cornerColor: this.options.controlColor,
                transparentCorners: false,
                selectable: this.isEditable
            }
        );
    }

    private getViewportSpacing( vertical: boolean ): number
    {
        if ( isArray( this.options.spacing ) )
        {
            return vertical ? this.options.spacing[0] : this.options.spacing[1];
        }
        else
        {
            return this.options.spacing;
        }
    }

}