import { EditorItemList } from './dnd-editor-item-list.model';
import {
    EditorItem,
    EditorItemInterface
} from './dnd-editor-item.model';

export class EditorBlockMap
{
    private _blocks: {[blockId: string]: EditorItemList} = {};

    public static create( data: {[blockId: string]: Array<EditorItemInterface>} ): EditorBlockMap
    {
        let map: EditorBlockMap = new EditorBlockMap();

        Object.keys( data ).forEach(
            (blockId: string) => {
                map._blocks[blockId] = EditorItemList.create( data[blockId] );
            }
        );

        return map;
    }

    public has( blockId: string ): boolean
    {
        return !!this._blocks[ blockId ];
    }

    public get( blockId: string ): EditorItemList
    {
        return this._blocks[blockId];
    }

    public set( blockId: string, itemList: EditorItemList )
    {
        this._blocks[blockId] = itemList;
    }

    public add( blockId: string, item: EditorItem, position: number = -1 )
    {
        if ( !this._blocks[blockId] )
        {
            this._blocks[blockId] = new EditorItemList();
        }

        this._blocks[blockId].add( item, position );
    }

    public serialize(): {[blockId: string]: Array<EditorItemInterface>}
    {
        let data: {[blockId: string]: Array<EditorItemInterface> } = {};

        Object.keys( this._blocks ).forEach(
            (blockId: string) => {
                data[blockId] = this._blocks[blockId].serialize();
            }
        );

        return data;
    }
}