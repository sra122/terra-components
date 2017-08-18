import { Component, EventEmitter } from "@angular/core";
import { PropertyInputComponent } from "../property-input-component.interface";
import { DndEditorElementProperty } from "../../../../model/dnd-editor-element-property.decorator";

@Component({
    selector: 'dnd-editor-color-property-input',
    template: require('./checkbox-property-input.component.html')
})
export class CheckboxPropertyInputComponent implements PropertyInputComponent<boolean>
{
    public property: DndEditorElementProperty;
    public value: boolean;
    public valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    public setValue( value: boolean )
    {
        this.value = value;
        this.valueChanged.emit( value );
    }

}