import {
    Component,
    EventEmitter
} from '@angular/core';
import { PropertyInputComponent } from '../property-input-component.interface';
import { DndEditorElementProperty } from '../../../../model/dnd-editor-element-property.decorator';

@Component({
    selector: 'dnd-editor-file-property-input',
    template: require('./file-property-input.component.html')
})
export class FilePropertyInputComponent implements PropertyInputComponent<string>
{
    public property:DndEditorElementProperty;
    public value:string;
    public valueChange:EventEmitter<string> = new EventEmitter<string>();

    public setValue(value: string)
    {
        this.value = value;
        this.valueChange.emit( value );
    }

}