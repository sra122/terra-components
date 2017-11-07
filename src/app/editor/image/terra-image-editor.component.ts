import {
    Component,
    Input,
    ViewChild
} from '@angular/core';
import { TerraEditableImageComponent } from './editable-image/terra-editable-image.component';
import { TerraEditableImageProperties } from './data/editable-image-properties.interface';

const FOO = "asd";

@Component({
    selector: 'terra-image-editor',
    template: require('./terra-image-editor.component.html'),
    styles: [require('./terra-image-editor.component.scss')]
})
export class TerraImageEditorComponent
{
    @Input()
    public inputImageUrl: string;

    @Input()
    public inputSpacing:number|[number,number] = 0;

    @ViewChild(TerraEditableImageComponent)
    private _editableImage: TerraEditableImageComponent;

    private _zoom:number = 100;
    private _zoomMin:number = 10;
    private _zoomMax:number = 200;

    private _isScaling:boolean = false;
    private _originalSize:{width: number, height: number};

    private _imageProperties: TerraEditableImageProperties;

    private increaseZoom()
    {
        let diff:number = 10 - (this._zoom % 10);
        if ( this._zoom + diff <= this._zoomMax )
        {
            this._zoom += diff;
        }
    }

    private decreaseZoom()
    {
        let diff:number = this._zoom % 10 || 10;
        if ( this._zoom - diff >= this._zoomMin )
        {
            this._zoom -= diff;
        }
    }

    private startScaling()
    {
        this._isScaling = true;
        this._originalSize = {
            width: this._imageProperties.width,
            height: this._imageProperties.height
        };
        this._editableImage.startScaling();
    }

    private stopScaling( resetScale: boolean = false )
    {
        this._isScaling = false;
        if ( resetScale )
        {
            this._imageProperties.width = this._originalSize.width;
            this._imageProperties.height = this._originalSize.height;
        }
        else
        {
            this._originalSize = null;
        }

        this._editableImage.stopScaling();
    }

    private rotateLeft()
    {
        this._editableImage.rotateBy(-90);
    }

    private rotateRight()
    {
        this._editableImage.rotateBy(90);
    }

    private autoZoom()
    {
        this._editableImage.autoZoom();
    }
}