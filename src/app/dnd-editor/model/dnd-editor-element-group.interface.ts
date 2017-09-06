import { DndEditorElement } from './dnd-editor-element.interface';

export interface DndEditorElementGroup
{
    id?:string;
    name:string;
    elements:DndEditorElement[];
}