import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

@Component({
               selector: 'terra-button',
               styles:   [require('./terra-button.component.scss')],
               template: require('./terra-button.component.html')
           })
export class TerraButtonComponent
{
    @Input() inputIsPrimary:boolean;
    @Input() inputIsSecondary:boolean;
    @Input() inputIsSmall:boolean;
    @Input() inputIsLarge:boolean;
    @Input() inputIsDisabled:boolean;
    @Input() inputCaption:string;
    @Input() inputIcon:string;
    @Input() inputType:string;
    @Input() inputIsAlignRight:boolean;
    @Input() inputIsHidden:boolean;
    @Input() inputTooltipText:string;
    @Input() inputTooltipPlacement:string; //top, bottom, left, right
    @Output() outputClicked = new EventEmitter<any>();
    @Input () inputIsActive: boolean;
    
    constructor()
    {
        this.inputTooltipPlacement = 'top';
        this.inputType = 'button';
        this.inputIsActive = false;
    }
    
    private click():void
    {
        this.outputClicked.emit(null);
    }
}
