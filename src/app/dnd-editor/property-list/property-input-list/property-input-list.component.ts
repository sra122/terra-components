import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { EditorPropertyInterface } from '../../model/dnd-editor-property.decorator';

@Component({
    selector: 'dnd-editor-property-input-list',
    template: require('./property-input-list.component.html'),
    styles:   [require('./property-input-list.component.scss')]
})
export class ElementPropertyInputListComponent
{
    // the property to render a list of input components for
    @Input()
    public property:EditorPropertyInterface;

    // list of values for each rendered input component
    @Input()
    public value:any[] = [];

    // emits changes to any rendered input component in the list
    @Output()
    public valueChange:EventEmitter<any[]> = new EventEmitter<any[]>();

    /**
     * Assign property value at defined index
     * @param index     number  The index of the input component
     * @param value     any     The value to assign
     */
    public setPropertyValue(index:number, value:any)
    {
        this.value[index] = value;
        this.valueChange.emit(this.value);
    }

    /**
     * Track list entries by index
     * @param index
     * @param item
     * @returns {number}
     */
    public trackByFn(index:number, item:any)
    {
        return index;
    }

    /**
     * Add new input component
     */
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

    /**
     * Remove input component at given index.
     * @param index
     */
    public removeEntry(index:number)
    {
        this.value.splice(index, 1);
        this.valueChange.emit(this.value);
    }

    /**
     * Clone definition of editor property and append index to label
     * @param index
     * @returns {EditorPropertyInterface}
     */
    private cloneProperty(index:number):EditorPropertyInterface
    {
        let clone:EditorPropertyInterface = {
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