import { EditorComponent } from './dnd-editor-component.interface';

export interface EditorComponentGroup
{
    id?:string;
    name:string;
    components:EditorComponent[];
}