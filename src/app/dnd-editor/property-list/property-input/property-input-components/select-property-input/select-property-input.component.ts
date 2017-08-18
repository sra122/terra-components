import { Component, EventEmitter, OnInit } from "@angular/core";
import { PropertyInputComponent } from "../property-input-component.interface";
import { DndEditorElementProperty } from "../../../../model/dnd-editor-element-property.decorator";
import { TerraSelectBoxValueInterface } from "../../../../../forms/select-box/data/terra-select-box.interface";

@Component({
    selector: 'dnd-editor-text-property-input',
    template: require('./select-property-input.component.html'),
})
export class SelectPropertyInputComponent implements PropertyInputComponent<any>, OnInit
{

    public property: DndEditorElementProperty;
    public value: any;
    public valueChanged: EventEmitter<any> = new EventEmitter<any>();

    public selectValues: TerraSelectBoxValueInterface[] = [];

    public ngOnInit(): void
    {
        if ( !this.property.values )
        {
            console.warn( "ElementPropertyType.SELECT requires 'values' to be defined." );
        }
        else
        {
            this.selectValues = Object.keys( this.property.values ).map( (key: string) => {
                return {
                    value: key,
                    caption: this.property.values[key]
                };
            });
        }

    }

    public setValue( value: any )
    {
        this.value = value;
        this.valueChanged.emit( value );
    }

}