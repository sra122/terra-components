import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { TwoColumnHelper } from '../../../../helpers/two-column.helper';

/**
 * @author mfrank
 */
@Component({
    selector: 'terra-3-col',
    styles:   [require('./terra-three-columns-container.component.scss')],
    template: require('./terra-three-columns-container.component.html')
})
/**
 * @experimental TerraThreeColumnsContainerComponent is experimental and might be subject to drastic changes in the near future.
 * It is also not compatible with the mobileRouting directive yet.
 *
 * @description Container which displays content/views in 3 columns using bootstraps grid system.
 * You can specifiy the width of the columns by using the three given inputs.
 * The sum of all given column width must be 12 at all times to ensure the deserved behaviour. If not, the column widths are calculated automatically.
 */
export class TerraThreeColumnsContainerComponent implements OnChanges
{
    /**
     * @description size of the left column
     */
    @Input()
    public columnWidths:Array<number> = [4, 4, 4];

    protected displayColumns:Array<number>;

    constructor()
    {
        this.displayColumns = this.columnWidths;
    }

    public ngOnChanges(changes:SimpleChanges):void
    {
        let sumOfColumnWidths:number = this.columnWidths.reduce((acc:number, curr:number) => acc + curr);
        if(sumOfColumnWidths > 12)
        {
            console.error('You have exceeded the maximum amount of columns. The columns are now sized automatically.');
        }

        let columnsLeft:number = TwoColumnHelper.maxColumnWidth;
        this.displayColumns = this.columnWidths.map((columnWidth:number) =>
        {
            let limitedColumnWidth:number = Math.min(columnsLeft, Math.max(TwoColumnHelper.minColumnWidth, columnWidth));
            columnsLeft -= limitedColumnWidth;
            return limitedColumnWidth;
        });

        if(columnsLeft > 0)
        {
            this.displayColumns[this.displayColumns.length - 1] += columnsLeft;
        }
    }

    protected getStylesForColumn(columnWidth:number):string
    {
        if(columnWidth)
        {
            return `col-xs-12 col-md-${columnWidth}`;
        }

        return null;
    }
}
