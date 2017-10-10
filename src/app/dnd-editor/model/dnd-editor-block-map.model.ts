import { EditorItemList } from './dnd-editor-item-list.model';
import {
    EditorItem,
    EditorItemInterface
} from './dnd-editor-item.model';
import { Subject } from 'rxjs/Subject';

/**
 * Collection in lists of editor items.
 */
export class EditorBlockMap
{
    // the map itself. A blockId references a dropzoneId in the editor
    private _blocks: {[blockId: string]: EditorItemList} = {};

    public onChange: Subject<EditorBlockMap> = new Subject();

    public get idList(): Array<string>
    {
        return Object.keys( this._blocks );
    }

    /**
     * Create a new Map from plain object.
     * @param data  Object  Plain data of all blocks with contained items
     * @returns EditorBlockMap
     */
    public static create( data: {[blockId: string]: Array<EditorItemInterface>} ): EditorBlockMap
    {
        let map: EditorBlockMap = new EditorBlockMap();

        Object.keys( data ).forEach(
            (blockId: string) => {
                map._blocks[blockId] = EditorItemList.create( data[blockId] );
                map._blocks[blockId].onChange.subscribe( () => {
                    map.onChange.next();
                });
            }
        );

        return map;
    }

    /**
     * Check if the map contains an entry for a given blockId (dropzoneId)
     * @param blockId   string
     * @returns {boolean}
     */
    public has( blockId: string ): boolean
    {
        return !!this._blocks[ blockId ];
    }

    /**
     * Get a list of editor items for a blockId (dropzoneId)
     * @param blockId   string
     * @returns {EditorItemList}
     */
    public get( blockId: string ): EditorItemList
    {
        return this._blocks[blockId];
    }

    /**
     * Assign a list of editor items to a given blockId.
     * @param blockId   string
     * @param itemList  EditorItemList
     */
    public set( blockId: string, itemList: EditorItemList )
    {
        this._blocks[blockId] = itemList;
        this.onChange.next();
    }

    /**
     * Add a single editor item to a list referenced by a blockId (dropzoneId).
     * If referenced item list does not exist, a new list will be created for the given blockId.
     * If position is not defined, the item will be appended to the list.
     * @param blockId   string
     * @param item      EditorItem
     * @param position  number
     */
    public add( blockId: string, item: EditorItem, position: number = -1 )
    {
        if ( !this._blocks[blockId] )
        {
            this._blocks[blockId] = new EditorItemList();
            this._blocks[blockId].onChange.subscribe( () => {
                this.onChange.next();
            });
        }

        this._blocks[blockId].add( item, position );
        this.onChange.next();
    }

    /**
     * Serialize the map to plain javascript object.
     * @returns {{[p: string]: Array<EditorItemInterface>}}
     */
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