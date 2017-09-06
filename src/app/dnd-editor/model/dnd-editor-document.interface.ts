export interface DndEditorDocumentItem
{
    name:string;
    selector?:string;
    properties?:{ [key:string]:any };
    children?:DndEditorDocument;
}

export type DndEditorDocument = { [dropzoneId:string]:DndEditorDocumentItem[] }