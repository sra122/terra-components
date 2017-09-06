import {
    Component,
    EventEmitter
} from '@angular/core';
import { PropertyInputComponent } from '../property-input-component.interface';
import { DndEditorElementProperty } from '../../../../model/dnd-editor-element-property.decorator';

@Component({
    selector: 'dnd-editor-color-property-input',
    template: require('./color-property-input.component.html')
})
export class ColorPropertyInputComponent implements PropertyInputComponent<string>
{
    public property:DndEditorElementProperty;
    public value:string;
    public valueChanged:EventEmitter<string> = new EventEmitter<string>();

    public setValue(value:string)
    {
        this.value = value;
        this.valueChanged.emit(value);
    }

}