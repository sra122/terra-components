import { TerraDataTableRowInterface } from '../data-table/row/terra-data-table-row.interface';
import {
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { TerraDataTableHeaderCellInterface } from '../data-table/cell/terra-data-table-header-cell.interface';

export class TerraBaseTableComponent<T>
{
    /**
     * @description List of header cell elements
     */
    @Input() inputHeaderList:Array<TerraDataTableHeaderCellInterface>;
    /**
     * @description List of table rows containing all the data
     */
    @Input() inputRowList:Array<TerraDataTableRowInterface<T>>;
    /**
     * @description EventEmitter that notifies when a row has been selected via the select box. This is enabled, only if `inputHasCheckboxes` is true.
     */
    @Output() outputRowCheckBoxChanged:EventEmitter<TerraDataTableRowInterface<T>> = new EventEmitter();

    protected _headerCheckbox:{ checked:boolean, isIndeterminate:boolean };
    protected _selectedRowList:Array<TerraDataTableRowInterface<T>>;

    protected onHeaderCheckboxChange():void
    {
        if(this._headerCheckbox.checked)
        {
            this.resetSelectedRows();
        }
        else
        {
            this.selectAllRows();
        }
    }

    protected onRowCheckboxChange(row:TerraDataTableRowInterface<T>):void
    {
        // notify component user
        this.outputRowCheckBoxChanged.emit(row);

        // update row selection
        if(this.isSelectedRow(row))
        {
            this.deselectRow(row);
        }
        else
        {
            this.selectRow(row);
        }

        // update header checkbox state
        this.updateHeaderCheckboxState();
    }

    protected checkHeaderCheckbox():void
    {
        this._headerCheckbox.checked = true;
        this._headerCheckbox.isIndeterminate = false;
    }

    protected uncheckHeaderCheckbox():void
    {
        this._headerCheckbox.checked = false;
        this._headerCheckbox.isIndeterminate = false;
    }

    protected setHeaderCheckboxIndeterminate():void
    {
        this._headerCheckbox.checked = false;
        this._headerCheckbox.isIndeterminate = true;
    }

    protected updateHeaderCheckboxState()
    {
        if(this._selectedRowList.length === 0) // anything selected?
        {
            this.uncheckHeaderCheckbox();
        }
        else if(this._selectedRowList.length > 0 && this.inputRowList.length === this._selectedRowList.length) // all selected?
        {
            this.checkHeaderCheckbox();
        }
        else // some rows selected -> indeterminate
        {
            this.setHeaderCheckboxIndeterminate();
        }
    }

    protected selectRow(row:TerraDataTableRowInterface<T>):void
    {
        // check if row is already selected
        if(this._selectedRowList.find((r:TerraDataTableRowInterface<T>) => r === row))
        {
            return;
        }

        // add row to selected row list
        this._selectedRowList.push(row);
    }

    protected deselectRow(row:TerraDataTableRowInterface<T>):void
    {
        // get index of the row in the selected row list
        let rowIndex:number = this._selectedRowList.indexOf(row);

        // check if selected row list contains the given row
        if(rowIndex >= 0)
        {
            // remove row from selected row list
            this._selectedRowList.splice(rowIndex, 1);
        }
    }

    protected selectAllRows():void
    {
        this.checkHeaderCheckbox();

        this.inputRowList.forEach((row) =>
        {
            if(!row.disabled)
            {
                this.selectRow(row);
            }
        });
    }

    protected resetSelectedRows():void
    {
        this.uncheckHeaderCheckbox();

        // reset selected row list
        this._selectedRowList = [];
    }

    protected isSelectedRow(row:TerraDataTableRowInterface<T>):boolean
    {
        return this._selectedRowList.indexOf(row) >= 0;
    }
}