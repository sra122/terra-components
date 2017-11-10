import { EditableImageTransformation } from '../editable-image-transformation.interface';
import { FabricImage } from '../fabric/fabric.interface';

export class RotateTransformation implements EditableImageTransformation
{
    constructor( private clockwise: boolean )
    {

    }

    public transform(image:FabricImage):void
    {
        //image.angle = image.angle + (this.clockwise ? 90 : -90);
    }
}