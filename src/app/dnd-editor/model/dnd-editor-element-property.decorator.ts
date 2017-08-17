import { PropertyInputComponent } from "../property-list/property-input/property-input-components/property-input-component.interface";
import { Type } from "@angular/core";
export const DND_EDITOR_PROPERTY_METADATA_KEY = "DND_EDITOR_PROPERTY_METADATA_KEY";

export function ElementProperty( propertyDescription: DndEditorElementProperty ): PropertyDecorator
{
    return ( target: Object, propertyKey: string | symbol ) => {

        let elementProperties: {[key: string]: DndEditorElementProperty} = Reflect.getMetadata(
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
            Reflect.getMetadata( "design:type", target, propertyKey ),
            target.constructor,
            propertyKey
        );

        // console.log( Reflect.getMetadata( "design:type", target, propertyKey ) );
    }
}

export interface DndEditorElementProperty
{
    label: string,
    type: Type<PropertyInputComponent<any>>
}