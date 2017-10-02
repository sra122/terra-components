import {
    Component,
    EventEmitter
} from '@angular/core';
import { PropertyInputComponent } from '../property-input-component.interface';
import { EditorPropertyInterface } from '../../../../model/dnd-editor-property.decorator';

@Component({
    selector: 'dnd-editor-color-property-input',
    template: require('./color-property-input.component.html')
})
export class ColorPropertyInputComponent implements PropertyInputComponent<string>
{
    public property:EditorPropertyInterface;
    public value:string;
    public valueChange:EventEmitter<string> = new EventEmitter<string>();

    public setValue(value:string)
    {
        this.value = value;
        this.valueChange.emit(value);
    }

}