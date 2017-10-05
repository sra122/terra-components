import { EditorItemList } from './dnd-editor-item-list.model';
import { EditorDocumentInterface } from './dnd-editor-document.model';
import { EditorBlockMap } from './dnd-editor-block-map.model';

/**
 * Plain representation of a single editor element in the document.
 * Each element represents a rendered EditorComponent and its property values.
 */
export interface EditorElementInterface
{
    // The name of the rendered angular component
    name: string;

    // The property values of the component
    properties?: {[key: string]: any};

    // Map of child elements assigned to dropzones in the rendered component
    children?: EditorDocumentInterface
}

/**
 * Plain representation of a single editor section.
 */
export interface EditorSectionInterface
{
    // The target of the section, e.g. a template to write assigned elements to.
    target: string;

    // Child elements of the section
    children?: EditorDocumentInterface
}

/**
 * Shorthand type definition: An EditorItem could be ether an EditorElement or an EditorSection
 */
export type EditorItemInterface = EditorElementInterface | EditorSectionInterface;

/**
 * An editor item is a node in the editor's document tree.
 * Each item could be ether a section or an element.
 */
export class EditorItem
{
    // Name of the angular component. (Only for editor elements)
    public name: string = null;

    // The target of this item. (Only for sections)
    public target: string = null;

    // Properties and its values (Only for elements)
    public properties: {[key: string]: any} = {};

    // Child items
    public children: EditorBlockMap = new EditorBlockMap();

    /**
     * Create a new instance from plain data.
     * @param data  EditorItemInterface
     * @returns {EditorItem}
     */
    public static create( data: EditorItemInterface ): EditorItem
    {
        let item = new EditorItem();

        Object.keys( data.children ).forEach( (dropzoneId: string) => {
            item.children.set(
                dropzoneId,
                EditorItemList.create( data.children[dropzoneId] )
            );
        });

        if ( (<EditorElementInterface> data).name )
        {
            // item is editor element
            let itemData: EditorElementInterface = <EditorElementInterface> data;
            item.name = itemData.name;
            item.properties = itemData.properties;
        }
        else
        {
            // item is editor section
            let sectionData: EditorSectionInterface = <EditorSectionInterface> data;
            item.target = sectionData.target;
        }

        return item;
    }

    /**
     * Check if item is a section.
     * @returns {boolean}
     */
    public get isSection(): boolean
    {
        return this.target !== null;
    }

    /**
     * Serialize to plain javascript object.
     * @returns EditorItemInterface
     */
    public serialize(): EditorItemInterface
    {
        if ( this.isSection )
        {
            return {
                target: this.target,
                children: this.children.serialize()
            };
        }
        else
        {
            return {
                name: this.name,
                properties: this.properties,
                children: this.children.serialize()
            };
        }
    }
}