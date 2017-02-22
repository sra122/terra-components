import {
    Component,
    OnInit,
    Input
} from '@angular/core';
import { TerraTagInterface } from '../tag/data/terra-tag.interface';

@Component({
               selector: 'terra-info-box',
               styles:   [require('./terra-info-box.component.scss')],
               template: require('./terra-info-box.component.html')
           })
export class TerraInfoBoxComponent implements OnInit
{
    @Input() inputTagList:Array<TerraTagInterface>;
    
    constructor()
    {
    }
    
    ngOnInit()
    {
    }
}
