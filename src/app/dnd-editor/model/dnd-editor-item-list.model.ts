import {
    EditorItemInterface,
    EditorItem
} from './dnd-editor-item.model';

export class EditorItemList
{
    private _items: Array<EditorItemListEntry> = [];

    private _head: EditorItemListEntry = null;

    private get _tail(): EditorItemListEntry
    {
        return this._entry( this.length - 1 );
    }

    public static create( dataList: Array<EditorItemInterface> ): EditorItemList
    {
        let itemList: EditorItemList = new EditorItemList();
        dataList.forEach( (data: EditorItemInterface) => {
            itemList.add(
                EditorItem.create( data )
            );
        });

        return itemList;
    }

    public get length(): number
    {
        return this._items.length;
    }

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

    public item( position: number ): EditorItem
    {
        let entry = this._entry( position );
        return entry ? entry.item : null;
    }

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

    public set( item: EditorItem, position: number )
    {
        let entry: EditorItemListEntry = this._entry( position );
        if ( entry )
        {
            entry.item = item;
        }
    }

    public add( item: EditorItem, position: number = -1 )
    {
        let listEntry = new EditorItemListEntry( item );
        if ( position < 0 || position >= this.length )
        {
            position = this.length;
        }

        this._insertListEntry( listEntry, position );
    }

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

    public contains( item: EditorItem )
    {
        return this.positionOf( item ) >= 0;
    }

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

            prevEntry.next = nextEntry;
            let idx: number = this._items.indexOf( entry );
            this._items.splice( idx, 1 );
        }
    }

    public serialize(): Array<EditorItemInterface>
    {
        return this.items.map(
            (item: EditorItem) => {
                return item.serialize();
            }
        );
    }
}

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