import { PropertyInputComponent } from '../property-list/property-input/property-input-components/property-input-component.interface';
import { Type } from '@angular/core';
import { EditorPropertyType } from '../property-list/editor-property-type.const';
import { isNullOrUndefined } from 'util';
import { DndEditorService } from '../dnd-editor.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
export const DND_EDITOR_PROPERTY_METADATA_KEY = "DND_EDITOR_PROPERTY_METADATA_KEY";
declare type KeyValue = {key: string, value: any};

const ElementPropertyChange: Subject<{instance: any, key: string, value: any}> = new Subject();

export function EditorProperty(propertyDescription?:EditorPropertyInterface):PropertyDecorator
{
    if ( propertyDescription )
    {
        if ( propertyDescription.type === EditorPropertyType.SELECT
             && (isNullOrUndefined(propertyDescription.values) || Object.keys(propertyDescription.values).length <= 0) )
        {
            console.error("'values' are required for ElementPropertyType.SELECT");
        }
        if ( propertyDescription.type === EditorPropertyType.SLIDER
             && (isNullOrUndefined(propertyDescription.min) || isNullOrUndefined(propertyDescription.max)) )
        {
            console.error( "'min' and 'max' are required for ElementPropertyType.SLIDER");
        }
    }

    return (target:Object, propertyKey:string) =>
    {
        // Store property description in "global" metadata of object's constructor
        let elementProperties:{ [key:string]:EditorPropertyInterface } = Reflect.getMetadata(
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
                        ElementPropertyChange.next({
                            instance: this,
                            key: propertyKey,
                            value: value
                        });
                        this["$_" + propertyKey] = value;
                    }
                }
            }
        );
    }
}

export function OnEditorPropertyChange( component: any, callback: (key: string, value: any) => void ): Subscription
{
    return ElementPropertyChange.subscribe( (arg: { instance: string, key: string, value: any} ) => {
        if ( arg.instance === component )
        {
            callback( arg.key, arg.value );
        }
    });
}

export interface EditorPropertyInterface
{
    label:string,
    type:Type<PropertyInputComponent<any>>,
    values?:{ [key:string]:string };
    min?:number;
    max?:number;
    interval?:number;
    extensions?:Array<string>
}