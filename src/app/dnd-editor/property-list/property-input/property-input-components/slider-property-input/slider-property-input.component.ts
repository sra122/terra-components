import {
    Component,
    EventEmitter
} from '@angular/core';
import { PropertyInputComponent } from '../property-input-component.interface';
import { DndEditorElementProperty } from '../../../../model/dnd-editor-element-property.decorator';

@Component({
    selector: 'dnd-editor-slider-property-input',
    template: require('./slider-property-input.component.html')
})
export class SliderPropertyInputComponent implements PropertyInputComponent<number>
{
    public property:DndEditorElementProperty;
    public value:number;
    public valueChange:EventEmitter<number> = new EventEmitter<number>();

    public setValue( value:number )
    {
        this.value = value;
        this.valueChange.emit(value)
    }

}