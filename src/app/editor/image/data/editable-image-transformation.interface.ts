import { FabricImage } from './fabric/fabric.interface';

export interface EditableImageTransformation
{
    transform( image: FabricImage ): void;
}