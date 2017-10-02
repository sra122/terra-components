import {
    EditorElementInterface,
    EditorItemInterface,
    EditorSectionInterface
} from './dnd-editor-item.model';
import { EditorBlockMap } from './dnd-editor-block-map.model';

export interface EditorDocumentInterface
{
    [blockId: string]: Array<EditorItemInterface>
}

export class EditorDocument
{
    public blocks: EditorBlockMap = new EditorBlockMap();

    public static create( data: EditorDocumentInterface ): EditorDocument
    {
        let document = new EditorDocument();

        document.blocks = EditorBlockMap.create( data );

        return document;
    }

    public serialize(): EditorDocumentInterface
    {
        return this.blocks.serialize();
    }
}