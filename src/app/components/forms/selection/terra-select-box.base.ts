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

    private _dropdownOpen:boolean = false;
    private readonly clickListener:(event:Event) => void;

    constructor(private elementRef:ElementRef)
    {
        this.clickListener = (event:Event):void =>
        {
            this.clickedOutside(event);
        };
    }

    protected toggleDropdown(evt:Event):void
    {
        evt.stopPropagation(); // prevents the click listener on the document to be fired right after
        this.dropdownOpen = !this.dropdownOpen;
    }

    protected set dropdownOpen(value:boolean)
    {
        if(this._dropdownOpen !== value && value === true)
        {
            document.addEventListener('click', this.clickListener, true);
        }
        else if(this._dropdownOpen !== value && value === false)
        {
            document.removeEventListener('click', this.clickListener);
        }

        this._dropdownOpen = value;
    }

    protected get dropdownOpen():boolean
    {
        return this._dropdownOpen;
    }

    private clickedOutside(event:Event):void
    {
        if(!this.elementRef.nativeElement.contains(event.target))
        {
            this.dropdownOpen = false;
        }
    }

}
