import { EditorItemList } from './dnd-editor-item-list.model';
import { EditorDocumentInterface } from './dnd-editor-document.model';
import { EditorBlockMap } from './dnd-editor-block-map.model';

export interface EditorElementInterface
{
    name: string;
    properties?: {[key: string]: any};
    children?: EditorDocumentInterface
}

export interface EditorSectionInterface
{
    target: string;
    children?: EditorDocumentInterface
}

export type EditorItemInterface = EditorElementInterface | EditorSectionInterface;

export class EditorItem
{
    public name: string = null;
    public target: string = null;
    public properties: {[key: string]: any} = {};
    public children: EditorBlockMap = new EditorBlockMap();

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
            let itemData: EditorElementInterface = <EditorElementInterface> data;
            item.name = itemData.name;
            item.properties = itemData.properties;
        }
        else
        {
            let sectionData: EditorSectionInterface = <EditorSectionInterface> data;
            item.target = sectionData.target;
        }

        return item;
    }

    public get isSection(): boolean
    {
        return this.target !== null;
    }

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