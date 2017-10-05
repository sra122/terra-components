import {
    EditorElementInterface,
    EditorItemInterface,
    EditorSectionInterface
} from './dnd-editor-item.model';
import { EditorBlockMap } from './dnd-editor-block-map.model';

/**
 * Plain representation of an EditorDocument
 */
export interface EditorDocumentInterface
{
    [blockId: string]: Array<EditorItemInterface>
}

/**
 * The document representing the currently assigned components and its property values.
 */
export class EditorDocument
{
    // Blocks of the document. Each block references a dropzone in the editor preview.
    public blocks: EditorBlockMap = new EditorBlockMap();

    /**
     * Create a new EditorDocument from plain data.
     * @param data  EditorDocumentInterface
     * @returns {EditorDocument}
     */
    public static create( data: EditorDocumentInterface ): EditorDocument
    {
        let document = new EditorDocument();

        document.blocks = EditorBlockMap.create( data );

        return document;
    }

    /**
     * Serialize to plain javascript object.
     * @returns Object
     */
    public serialize(): EditorDocumentInterface
    {
        return this.blocks.serialize();
    }
}