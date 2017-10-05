import { EditorComponent } from './dnd-editor-component.interface';

/**
 * A group of available components.
 */
export interface EditorComponentGroup
{
    // An optional identifier. Can be used to restrict allowed elements in ElementDropzones
    id?:string;

    // The displayed name of the group
    name:string;

    // The available components of this group
    components:EditorComponent[];
}