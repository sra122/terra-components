import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { DndEditorElementProperty } from '../../model/dnd-editor-element-property.decorator';

@Component({
    selector: 'dnd-editor-property-input-list',
    template: require('./property-input-list.component.html'),
    styles:   [require('./property-input-list.component.scss')]
})
export class ElementPropertyInputListComponent
{
    @Input()
    public property:DndEditorElementProperty;

    @Input()
    public value:any[] = [];

    @Output()
    public valueChange:EventEmitter<any[]> = new EventEmitter<any[]>();


    public setPropertyValue(index:number, value:any)
    {
        console.log("Set " + index + " to " + value);
        this.value[index] = value;
        this.valueChange.emit(this.value);
    }

    public trackByFn(index:number, item:any)
    {
        return index;
    }

    public addEntry()
    {
        if(!this.value)
        {
            this.value = [];
        }
        this.setPropertyValue(
            this.value.length,
            null
        );
    }

    public removeEntry(index:number)
    {
        this.value.splice(index, 1);
        this.valueChange.emit(this.value);
    }

    private cloneProperty(index:number):DndEditorElementProperty
    {
        let clone:DndEditorElementProperty = {
            label: this.property.label + " (" + index + ")",
            type:  this.property.type
        };

        Object.keys( this.property ).forEach( (propertyKey:string) => {
            if ( propertyKey !== "label" )
            {
                clone[propertyKey] = this.property[propertyKey];
            }
        });

        return clone;
    }
}