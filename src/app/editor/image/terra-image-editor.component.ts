import {
    Component,
    Input,
    ViewChild
} from '@angular/core';
import { TerraEditableImageComponent } from './editable-image/terra-editable-image.component';
import { TerraEditableImageProperties } from './data/editable-image-properties.interface';
import { RotateTransformation } from './data/transformations/rotate.transformation';

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
    private _editableImageComponent: TerraEditableImageComponent;

    private _zoom:number = 100;
    private _zoomMin:number = 10;
    private _zoomMax:number = 200;

    private _readyState: boolean = false;

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

    private rotate(clockwise:boolean)
    {
        this._editableImageComponent.applyTransformation(
            new RotateTransformation( clockwise )
        )
    }

    private autoZoom()
    {
        this._editableImageComponent.autoZoom();
    }
}