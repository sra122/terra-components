import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { TerraDataTableHeaderCellInterface } from './cell/terra-data-table-header-cell.interface';
import { TerraDataTableRowInterface } from './row/terra-data-table-row.interface';
import { TerraPagerInterface } from '../../pager/data/terra-pager.interface';
import { TerraDataTableContextMenuService } from './context-menu/service/terra-data-table-context-menu.service';
import {
    isArray,
    isNullOrUndefined
} from 'util';
import { TerraButtonInterface } from '../../button/data/terra-button.interface';
import { TerraRefTypeInterface } from './cell/terra-ref-type.interface';
import { TerraTagInterface } from '../../tag/data/terra-tag.interface';
import { TerraDataTableTextInterface } from './cell/terra-data-table-text.interface';
import { TerraDataTableSortOrder } from './terra-data-table-sort-order.enum';
import { TerraDataTableBaseService } from './terra-data-table-base.service';
import { TerraBaseTableComponent } from '../base/terra-base-table.component';
import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

/**
 * @author pweyrich
 */
@Component({
    selector:   'terra-data-table',
    template:   require('./terra-data-table.component.html'),
    styles:     [require('./terra-data-table.component.scss')],
    providers:  [TerraDataTableContextMenuService],
    animations: [
        trigger('collapsedState', [
            state('hidden', style({
                height:          '0',
                overflow:        'hidden',
                'margin-bottom': '0'
            })),
            state('collapsed', style({
                height:          '*',
                overflow:        'initial',
                'margin-bottom': '6px'
            })),
            transition('hidden <=> collapsed', [
                animate(300)

            ])
        ])
    ]
})
export class TerraDataTableComponent<T, P> extends TerraBaseTableComponent<T> implements OnInit, OnChanges
{
    /**
     * @description Service, that is used to request the table data from the server
     */
    @Input() inputService:TerraDataTableBaseService<T, P>;
    /**
     * @description enables the user to sort the table by selected columns
     */
    @Input() inputIsSortable:boolean;
    /**
     * @description show checkboxes in the table, to be able to select any row
     */
    @Input() inputHasCheckboxes:boolean;
    /**
     * @description show/hides the pager above the table
     */
    @Input() inputHasPager:boolean;
    /**
     * @description Primary text for no results notice
     */
    @Input() inputNoResultTextPrimary:string;
    /**
     * @description Secondary text for no results notice
     */
    @Input() inputNoResultTextSecondary:string;
    /**
     * @description Buttons for no results notice
     */
    @Input() inputNoResultButtons:Array<TerraButtonInterface>;
    @Input() inputShowGroupFunctions:boolean = false;
    @Input() inputGroupFunctionButtonIsDisabled:boolean = true;

    /**
     * @description EventEmitter that notifies when a row has been selected via the select box. This is enabled, only if `inputHasCheckboxes` is true.
     */
    @Output() outputGroupFunctionExecuteButtonClicked:EventEmitter<Array<TerraDataTableRowInterface<T>>> = new EventEmitter();

    private _sortOrderEnum = TerraDataTableSortOrder;

    /**
     * @description Constructor initializing the table component
     */
    constructor()
    {
        super();

        // set default input values
        this.inputHasCheckboxes = true;
        this.inputHasPager = true;
        this.inputIsSortable = false;

        // initialize local variables
        this._selectedRowList = [];
        this._headerCheckbox = {
            checked:         false,
            isIndeterminate: false
        };
    }

    /**
     * @description Initialization routine. It sets up the pager.
     */
    public ngOnInit():void
    {
        this.initPagination();
    }

    /**
     * @description Change detection routine. It resets the sorting configuration if the header list is updated.
     * @param {SimpleChanges} changes
     */
    public ngOnChanges(changes:SimpleChanges):void
    {
        if(changes['inputHeaderList'])
        {
            if(this.inputIsSortable)
            {
                this.resetSorting();
            }
        }
        if(changes['inputRowList'])
        {
            this.resetSelectedRows();
        }
    }

    /**
     * default initialization of the paging information which are stored in the input service
     */
    private initPagination()
    {
        let itemsPerPage:number = 25;
        if(this.inputService.defaultPagingSize)
        {
            itemsPerPage = this.inputService.defaultPagingSize;
        }
        else if(this.inputService.pagingSizes && this.inputService.pagingSizes[0])
        {
            itemsPerPage = this.inputService.pagingSizes[0].value;
        }

        // init paging data
        this.inputService.updatePagingData({
            page:           1,
            itemsPerPage:   itemsPerPage,
            totalsCount:    1,
            isLastPage:     true,
            lastPageNumber: 1,
            lastOnPage:     1,
            firstOnPage:    1
        });
    }

    private get getCollapsedState():string
    {
        if(this.inputShowGroupFunctions)
        {
            return 'collapsed';
        }
        else
        {
            return 'hidden';
        }
    }

    private onGroupFunctionExecuteButtonClicked(event:Event):void
    {
        this.outputGroupFunctionExecuteButtonClicked.emit(this.inputRowList);
    }

    /**
     * @description Getter for selectedRowList
     * @returns {Array<TerraDataTableRowInterface<T>>}
     */
    public get selectedRowList():Array<TerraDataTableRowInterface<T>>
    {
        return this._selectedRowList;
    }

    private rowClicked(row:TerraDataTableRowInterface<T>):void
    {
        if(!row.disabled)
        {
            this.inputRowList.forEach((r:TerraDataTableRowInterface<T>) =>
            {
                r.isActive = false;
            });

            row.isActive = true;
            row.clickFunction();
        }
    }

    private checkTooltipPlacement(placement:string):string
    {
        if(!isNullOrUndefined(placement) && placement !== '')
        {
            return placement;
        }

        return 'top';
    }

    private isTableDataAvailable():boolean
    {
        return this.inputRowList && this.inputRowList.length > 0;
    }

    private isNoResultsNoticeDefined():boolean
    {
        return (this.inputNoResultButtons && this.inputNoResultButtons.length > 0) || // a button is given
               (this.inputNoResultTextPrimary && this.inputNoResultTextPrimary.length > 0) || // a primary text is given
               (this.inputNoResultTextSecondary && this.inputNoResultTextSecondary.length > 0); // a secondary text is given
    }

    private doPaging(pagerData:TerraPagerInterface):void
    {
        // request data from server
        this.getResults();

        // reset row selections
        this.resetSelectedRows();
    }

    private getCellDataType(data:any):string
    {
        function isRefType(arg:any):arg is TerraRefTypeInterface
        {
            return arg
                   && arg.type && typeof arg.type == 'string'
                   && arg.value && typeof arg.value == 'string';
        }

        function isTextType(arg:any):arg is TerraDataTableTextInterface
        {
            return arg && arg.caption && typeof arg.caption == 'string';
        }

        function isTagArray(arg:any):arg is Array<TerraTagInterface>
        {
            // check if it is an array
            if(!isArray(arg))
            {
                return false;
            }

            // check if every element of the array implements the tag interface
            let implementsInterface:boolean = true;
            arg.forEach((elem:any) =>
            {
                implementsInterface = implementsInterface && elem.badge && typeof elem.badge == 'string';
            });

            return arg && implementsInterface;
        }

        function isButtonArray(arg:any):arg is Array<TerraButtonInterface>
        {
            // check if it is an array
            if(!isArray(arg))
            {
                return false;
            }

            // check if every element of the array implements the button interface
            let implementsInterface:boolean = true;
            arg.forEach((elem:any) =>
            {
                implementsInterface = implementsInterface && elem.clickFunction && typeof elem.clickFunction == 'function';
            });

            return arg && implementsInterface;
        }

        if(typeof data === 'object')
        {
            if(isRefType(data))
            {
                return 'TerraRefTypeInterface';
            }
            else if(isTextType(data))
            {
                return 'TerraDataTableTextInterface';
            }
            else if(isTagArray(data))
            {
                return 'tags';
            }
            else if(isButtonArray(data))
            {
                return 'buttons';
            }
        }
        return typeof data;
    }

    private onColumnHeaderClick(header:TerraDataTableHeaderCellInterface):void
    {
        // change sorting column and order only if no request is pending and sortBy attribute is given
        if(!this.inputService.requestPending && this.inputIsSortable && header.sortBy)
        {
            this.changeSortingColumn(header);
        }
    }

    private changeSortingColumn(header:TerraDataTableHeaderCellInterface)
    {
        // clicked on the same column?
        if(this.inputService.sortBy === header.sortBy)
        {
            // only change sorting order
            this.toggleSortingOrder();
        }
        else
        {
            this.inputService.sortBy = header.sortBy;
            this.inputService.sortOrder = TerraDataTableSortOrder.DESCENDING; // default is descending
        }

        // get Results with updated parameter
        this.getResults();
    }

    private toggleSortingOrder():void
    {
        this.inputService.sortOrder = this.inputService.sortOrder === TerraDataTableSortOrder.DESCENDING ?
            TerraDataTableSortOrder.ASCENDING :
            TerraDataTableSortOrder.DESCENDING;
    }

    private resetSorting():void
    {
        // sort by the first sortable column, if available
        let defaultSortColumn:TerraDataTableHeaderCellInterface = this.getFirstSortableColumn();
        if(this.inputHeaderList && defaultSortColumn)
        {
            this.inputService.sortBy = defaultSortColumn.sortBy;
            this.inputService.sortOrder = TerraDataTableSortOrder.DESCENDING;
        }
    }

    private getFirstSortableColumn():TerraDataTableHeaderCellInterface
    {
        // check if header list is given
        if(this.inputHeaderList)
        {
            // find first header cell where sortBy attribute is given
            let headerCell:TerraDataTableHeaderCellInterface;
            headerCell = this.inputHeaderList.find((header:TerraDataTableHeaderCellInterface) => !isNullOrUndefined(header.sortBy));
            if(headerCell)
            {
                return headerCell;
            }
        }

        // return null if nothing is found
        return null;
    }

    private getResults():void
    {
        this.inputService.getResults();
    }
}
