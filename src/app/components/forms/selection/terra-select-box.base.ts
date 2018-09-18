import {
    ElementRef,
    Input
} from '@angular/core';
import { TerraSelectBoxValueInterface } from '../../../..';

export class TerraSelectBoxBase
{
    @Input()
    public inputListBoxValues:Array<TerraSelectBoxValueInterface>;

    protected selectedValue:TerraSelectBoxValueInterface;

    private _toggleOpen:boolean = false;
    private readonly clickListener:(event:Event) => void;

    constructor(private elementRef:ElementRef)
    {
        this.clickListener = (event:Event):void =>
        {
            this.clickedOutside(event);
        };
    }

    protected onClick(evt:Event):void
    {
        evt.stopPropagation(); // prevents the click listener on the document to be fired right after
        this.toggleOpen = !this.toggleOpen;
    }

    protected set toggleOpen(value:boolean)
    {
        if(this._toggleOpen !== value && value === true)
        {
            document.addEventListener('click', this.clickListener, true);
        }
        else if(this._toggleOpen !== value && value === false)
        {
            document.removeEventListener('click', this.clickListener);
        }

        this._toggleOpen = value;
    }

    protected get toggleOpen():boolean
    {
        return this._toggleOpen;
    }

    private clickedOutside(event:Event):void
    {
        if(!this.elementRef.nativeElement.contains(event.target))
        {
            this.toggleOpen = false;
        }
    }

}
