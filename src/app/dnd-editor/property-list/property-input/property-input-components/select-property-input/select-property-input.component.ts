import {
    Component,
    EventEmitter,
    OnInit
} from '@angular/core';
import { PropertyInputComponent } from '../property-input-component.interface';
import { EditorPropertyInterface } from '../../../../model/dnd-editor-property.decorator';
import { TerraSelectBoxValueInterface } from '../../../../../forms/select-box/data/terra-select-box.interface';

@Component({
    selector: 'dnd-editor-text-property-input',
    template: require('./select-property-input.component.html'),
})
export class SelectPropertyInputComponent implements PropertyInputComponent<any>, OnInit
{

    public property:EditorPropertyInterface;
    public value:any;
    public valueChange:EventEmitter<any> = new EventEmitter<any>();

    public selectValues:TerraSelectBoxValueInterface[] = [];

    public ngOnInit():void
    {
        if(!this.property.values)
        {
            console.warn("ElementPropertyType.SELECT requires 'values' to be defined.");
        }
        else
        {
            this.selectValues = Object.keys(this.property.values).map((key:string) =>
            {
                return {
                    value:   key,
                    caption: this.property.values[key]
                };
            });
        }

    }

    public setValue(value:any)
    {
        this.value = value;
        this.valueChange.emit(value);
    }

}