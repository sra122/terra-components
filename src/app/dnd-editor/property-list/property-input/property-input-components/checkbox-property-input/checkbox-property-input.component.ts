import {
    Component,
    EventEmitter
} from '@angular/core';
import { PropertyInputComponent } from '../property-input-component.interface';
import { EditorPropertyInterface } from '../../../../model/dnd-editor-property.decorator';

@Component({
    selector: 'dnd-editor-color-property-input',
    template: require('./checkbox-property-input.component.html')
})
export class CheckboxPropertyInputComponent implements PropertyInputComponent<boolean>
{
    public property:EditorPropertyInterface;
    public value:boolean;
    public valueChange:EventEmitter<boolean> = new EventEmitter<boolean>();

    public setValue(value:boolean)
    {
        this.value = value;
        this.valueChange.emit(value);
    }

}