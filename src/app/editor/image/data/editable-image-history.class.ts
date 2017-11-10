import { EditableImageTransformation } from './editable-image-transformation.interface';
import {
    Fabric,
    FabricImage
} from './fabric/fabric.interface';

declare const fabric: Fabric;

export class EditableImageHistory
{
    private transformations: Array<EditableImageTransformation> = [];
    private revertedTransformations: Array<EditableImageTransformation> = [];

    public get canBeUndone(): boolean
    {
        return this.transformations.length > 0;
    }

    public get canBeRedone(): boolean
    {
        return this.revertedTransformations.length > 0;
    }

    constructor( private imageCtor: () => FabricImage )
    {
    }

    public push( transformation: EditableImageTransformation )
    {
        this.transformations.push( transformation );
        this.revertedTransformations = [];
    }

    public undo(): FabricImage
    {
        let lastTransformation: EditableImageTransformation = this.transformations.shift();
        if ( lastTransformation )
        {
            this.revertedTransformations.push( lastTransformation );
        }

        return this.reapplyTransformations();
    }

    public redo(): FabricImage
    {
        let nextTransformation: EditableImageTransformation = this.revertedTransformations.shift();
        if ( nextTransformation )
        {
            this.transformations.push( nextTransformation );
        }

        return this.reapplyTransformations();
    }

    private reapplyTransformations(): FabricImage
    {
        let image: FabricImage = this.imageCtor();
        this.transformations.forEach(
            (transformation: EditableImageTransformation) => {
                transformation.transform( image );
            }
        );

        return image;

    }
}