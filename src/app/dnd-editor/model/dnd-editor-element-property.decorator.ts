import { PropertyInputComponent } from '../property-list/property-input/property-input-components/property-input-component.interface';
import { Type } from '@angular/core';
import { ElementPropertyType } from '../property-list/element-property-type.const';
import { isNullOrUndefined } from 'util';
import { DndEditorService } from '../dnd-editor.service';
export const DND_EDITOR_PROPERTY_METADATA_KEY = "DND_EDITOR_PROPERTY_METADATA_KEY";

export function ElementProperty(propertyDescription?:DndEditorElementProperty):PropertyDecorator
{
    if ( propertyDescription )
    {
        if ( propertyDescription.type === ElementPropertyType.SELECT
             && (isNullOrUndefined(propertyDescription.values) || Object.keys(propertyDescription.values).length <= 0) )
        {
            console.error("'values' are required for ElementPropertyType.SELECT");
        }
        if ( propertyDescription.type === ElementPropertyType.SLIDER
             && (isNullOrUndefined(propertyDescription.min) || isNullOrUndefined(propertyDescription.max)) )
        {
            console.error( "'min' and 'max' are required for ElementPropertyType.SLIDER");
        }
    }

    return (target:Object, propertyKey:string) =>
    {
        let elementProperties:{ [key:string]:DndEditorElementProperty } = Reflect.getMetadata(
                DND_EDITOR_PROPERTY_METADATA_KEY,
                target.constructor
            ) || {};

        elementProperties[propertyKey] = propertyDescription;

        Reflect.defineMetadata(
            DND_EDITOR_PROPERTY_METADATA_KEY,
            elementProperties,
            target.constructor
        );

        Reflect.defineMetadata(
            "design:type",
            Reflect.getMetadata("design:type", target, propertyKey),
            target.constructor,
            propertyKey
        );

        Object.defineProperty(
            target,
            "$_" + propertyKey,
            {
                configurable: false,
                enumerable: false,
                value: target[propertyKey],
                writable: true
            }
        );

        Object.defineProperty(
            target,
            propertyKey,
            {
                enumerable: true,
                get: function() {
                    return this["$_" + propertyKey];
                },
                set: function(value) {
                    if ( value !== this["$_" + propertyKey] )
                    {
                        DndEditorService.onPropertyChange( this, propertyKey, this["$_" + propertyKey], value );
                        this["$_" + propertyKey] = value;
                    }
                }
            }
        )

        // console.log( Reflect.getMetadata( "design:type", target, propertyKey ) );
    }
}

export interface DndEditorElementProperty
{
    label:string,
    type:Type<PropertyInputComponent<any>>,
    values?:{ [key:string]:string };
    min?:number;
    max?:number;
    interval?:number;
    extensions?:Array<string>
}