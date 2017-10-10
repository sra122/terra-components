import {
    EditorItemInterface,
    EditorItem
} from './dnd-editor-item.model';
import { Subject } from 'rxjs/Subject';

/**
 * Linked list of editor items.
 */
export class EditorItemList
{
    // The items in this list. Not ordered
    private _items: Array<EditorItemListEntry> = [];

    // The first item in the list
    private _head: EditorItemListEntry = null;

    // The last item in the list
    private get _tail(): EditorItemListEntry
    {
        return this._entry( this.length - 1 );
    }

    public onChange: Subject<void> = new Subject();

    /**
     * Create a new instance from plain data
     * @param dataList  Array<EditorItemInterface>
     * @returns {EditorItemList}
     */
    public static create( dataList: Array<EditorItemInterface> ): EditorItemList
    {
        let itemList: EditorItemList = new EditorItemList();
        dataList.forEach( (data: EditorItemInterface) => {
            let item: EditorItem = EditorItem.create( data );

            item.onChange.subscribe( () => {
                itemList.onChange.next();
            });

            itemList.add( item );
        });

        return itemList;
    }

    /**
     * Get the length of the list.
     */
    public get length(): number
    {
        return this._items.length;
    }

    /**
     * Get the ordered items of the list.
     * @returns {Array<EditorItem>}
     */
    public get items(): Array<EditorItem>
    {
        let items: Array<EditorItem> = [];
        let current: EditorItemListEntry = this._head;

        while( current )
        {
            items.push( current.item );
            current = current.next;
        }

        return items;
    }

    /**
     * Get the item at a given position.
     * @param position
     * @returns {EditorItem}
     */
    public item( position: number ): EditorItem
    {
        let entry = this._entry( position );
        return entry ? entry.item : null;
    }

    /**
     * Get the entry at the given position.
     * @param position
     * @returns {any}
     * @private
     */
    private _entry( position ): EditorItemListEntry
    {
        if ( position < 0 || position >= this.length )
        {
            return null;
        }

        let count: number = 0;
        let current = this._head;
        while( current && count < position )
        {
            current = current.next;
            count++;
        }

        return current;
    }

    /**
     * Set an item at a given position.
     * If entry at given position does not exist, item will be appended to list.
     * IMPORTANT: The item at the given position will be replaced. Use add() to insert new item in list.
     * @param item      EditorItem
     * @param position  number
     */
    public set( item: EditorItem, position: number )
    {
        let entry: EditorItemListEntry = this._entry( position );
        if ( entry )
        {
            entry.item = item;
            this.onChange.next();
        }
    }

    /**
     * Insert a new item in the list at given position.
     * If position is not defined, the item will be appended to the list.
     * @param item      EditorItem
     * @param position  number
     */
    public add( item: EditorItem, position: number = -1 )
    {
        let listEntry = new EditorItemListEntry( item );
        if ( position < 0 || position >= this.length )
        {
            position = this.length;
        }

        this._insertListEntry( listEntry, position );
        this.onChange.next();
    }

    /**
     * Insert list entry at given position
     * @param listEntry EditorItemListEntry
     * @param position  number
     * @private
     */
    private _insertListEntry( listEntry: EditorItemListEntry, position: number )
    {
        if ( position === 0 )
        {
            if ( this._head !== null )
            {
                listEntry.next = this._head;
            }
            this._head = listEntry;
        }
        else
        {
            if ( this._head === null )
            {
                console.error( "Cannot insert entry at position " + position + ". Head is not defined" );
                return;
            }

            let nextEntry: EditorItemListEntry = this._entry( position );
            let prevEntry: EditorItemListEntry = nextEntry ? nextEntry.previous : this._tail;
            listEntry.previous = prevEntry;
            listEntry.next = nextEntry;

        }

        this._items.push( listEntry );
    }

    /**
     * Check if item is in the list
     * @param item  EditorItem
     * @returns {boolean}
     */
    public contains( item: EditorItem )
    {
        return this.positionOf( item ) >= 0;
    }

    /**
     * Get the position of a given item
     * @param item  EditorItem
     * @returns {number}
     */
    public positionOf( item: EditorItem ): number
    {
        let position: number = -1;
        let current: EditorItemListEntry = this._head;
        let count: number = 0;
        while( current )
        {
            if ( current.item === item )
            {
                return count;
            }
            count++;
            current = current.next;
        }

        return position;
    }

    /**
     * Remove an item from list.
     * Accepts either the item to remove or the position of the item to remove
     * @param itemOrPosition
     */
    public remove( itemOrPosition: EditorItem | number )
    {
        let position: number;

        if ( itemOrPosition instanceof EditorItem )
        {
            position = this.positionOf( itemOrPosition );
        }
        else
        {
            position = itemOrPosition;
        }

        let entry: EditorItemListEntry = this._entry( position );

        if ( entry )
        {
            let prevEntry: EditorItemListEntry = entry.previous;
            let nextEntry: EditorItemListEntry = entry.next;

            if ( prevEntry )
            {
                prevEntry.next = nextEntry;
            }
            else
            {
                // entry is first in list
                if ( nextEntry )
                {
                    nextEntry.previous = null;
                    this._head = nextEntry;
                }
                else
                {
                    // list is empty
                    this._head = null;
                }
            }
            let idx: number = this._items.indexOf( entry );
            this._items.splice( idx, 1 );
            this.onChange.next();
        }
    }

    /**
     * Serialize to plain javascript object.
     * @returns Array<EditorItemInterface>
     */
    public serialize(): Array<EditorItemInterface>
    {
        return this.items.map(
            (item: EditorItem) => {
                return item.serialize();
            }
        );
    }
}

/**
 * Single list entry. Wraps the assigned editor item and stores references to previous and next entries in the list.
 */
export class EditorItemListEntry
{
    private _next: EditorItemListEntry;
    private _previous: EditorItemListEntry;

    public get next(): EditorItemListEntry
    {
        return this._next;
    }
    
    public set next( entry: EditorItemListEntry )
    {
        if ( this._next !== entry )
        {
            let oldValue: EditorItemListEntry = this._next;
            if ( this._next )
            {
                this._next = null;
                oldValue.previous = null;
            }

            this._next = entry;

            if ( entry )
            {
                entry.previous = this;
            }
        }
    }

    public get previous(): EditorItemListEntry
    {
        return this._previous;
    }

    public set previous( entry: EditorItemListEntry )
    {
        if ( this._previous !== entry )
        {
            let oldValue: EditorItemListEntry = this._previous;
            if ( this._previous )
            {
                this._previous = null;
                oldValue.next = null;
            }

            this._previous = entry;

            if ( entry )
            {
                entry.next = this;
            }
        }
    }

    constructor( public item: EditorItem )
    {
    }
}