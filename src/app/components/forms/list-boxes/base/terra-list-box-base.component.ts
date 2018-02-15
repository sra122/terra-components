import {
    ElementRef,
    Input
} from '@angular/core';

export class TerraListBoxBaseComponent
{
    /**
     * @description Label of the List Box
     */
    @Input()
    public inputName:string;

    /**
     * @description states whether the input is required
     */
    @Input()
    public inputIsRequired:boolean;

    /**
     * @description disables the input if set
     */
    @Input()
    public inputIsDisabled:boolean;

    /**
     * @description Text for the tooltip
     */
    @Input()
    public inputTooltipText:string; // TODO: replace by enum

    /**
     * @description Placement of the tooltip. Supported values: left, right, top, bottom.
     */
    @Input()
    public inputTooltipPlacement:string;

    /**
     * @description
     */
    public isValid:boolean;
    private clickListener:(event:Event) => void;
    private _toggleOpen:boolean;

    constructor(private _elementRef:ElementRef)
    {
        this.clickListener = (event:Event):void => this.clickedOutside(event);
        this._toggleOpen = false;
        this.isValid = true;
    }

    /**
     * @description open/close the dropdown of the list box
     */
    public set toggleOpen(value:boolean)
    {
        if(this._toggleOpen !== value && value === true)
        {
            document.addEventListener('click', this.clickListener);
            this.focusSelectedElement();
        }
        else if(this._toggleOpen !== value && value === false)
        {
            document.removeEventListener('click', this.clickListener);
        }

        this._toggleOpen = value;
    }


    /**
     * @description
     */
    public get toggleOpen():boolean
    {
        return this._toggleOpen;
    }


    protected onClick(evt:Event):void
    {
        evt.stopPropagation(); // prevents the click listener on the document to be fired right after
        this.toggleOpen = !this.toggleOpen;
    }

    protected clickedOutside(event:Event):void
    {
        if(!this._elementRef.nativeElement.contains(event.target))
        {
            this.toggleOpen = false;
        }
    }

    protected focusSelectedElement():void
    {
        // get the temporary selected DOM element
        let selectedElement:HTMLElement = $('.select-box-dropdown > span.selected').get().pop();

        // check if the element has been found
        if(selectedElement)
        {
            // scroll to the selected element
            selectedElement.parentElement.scrollTop = selectedElement.offsetTop - selectedElement.parentElement.offsetTop;
        }
    }

    /**
     * workaround to prevent calling the select() method on the label click
     * @param event
     */
    protected onInputClick(event:any):void
    {
        // check if the input has been clicked
        if(event.target.nodeName === 'INPUT')
        {
            // select the input text <-> mark all
            event.target.select();
        }
    }
}
