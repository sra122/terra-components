import { PropertyInputComponent } from '../property-list/property-input/property-input-components/property-input-component.interface';
import { Type } from '@angular/core';
import { EditorPropertyType } from '../property-list/editor-property-type.const';
import { isNullOrUndefined } from 'util';
import { DndEditorService } from '../dnd-editor.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

// Shorthand definition for key-value-pairs
declare type KeyValue = {key: string, value: any};

// global change listener
const ElementPropertyChange: Subject<{instance: any, key: string, value: any}> = new Subject();

// Metadata key to get editor property data from
export const DND_EDITOR_PROPERTY_METADATA_KEY = "DND_EDITOR_PROPERTY_METADATA_KEY";

/**
 * Make the annotated property editable in editor's sidebar.
 * @param propertyDescription   EditorPropertyInterface
 * @returns PropertyDecorator
 */
export function EditorProperty(propertyDescription?:EditorPropertyInterface):PropertyDecorator
{
    // check for required fields depending on property type
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
        // Store property description in "global" metadata of object's constructor:
        // > 1. get previously defined properties
        let elementProperties:{ [key:string]:EditorPropertyInterface } = Reflect.getMetadata(
                DND_EDITOR_PROPERTY_METADATA_KEY,
                target.constructor
            ) || {};

        // > 2. add current property description
        elementProperties[propertyKey] = propertyDescription;

        // > 3. set property descriptions
        Reflect.defineMetadata(
            DND_EDITOR_PROPERTY_METADATA_KEY,
            elementProperties,
            target.constructor
        );

        // store type information of current property
        Reflect.defineMetadata(
            "design:type",
            Reflect.getMetadata("design:type", target, propertyKey),
            target.constructor,
            propertyKey
        );

        // Define private property
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

        // Override properties accessors
        Object.defineProperty(
            target,
            propertyKey,
            {
                enumerable: true,
                get: function() {
                    // get value from previously defined private property
                    return this["$_" + propertyKey];
                },
                set: function(value) {
                    // set value and call property change listeners
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

/**
 * Listen to property changes in a given object
 * @param component     The object to listen on property changes
 * @param callback      Handler to be called on every property change on the given object.
 * @returns {Subscription}
 */
export function OnEditorPropertyChange( component: any, callback: (key: string, value: any) => void ): Subscription
{
    return ElementPropertyChange.subscribe( (arg: { instance: string, key: string, value: any} ) => {
        if ( arg.instance === component )
        {
            callback( arg.key, arg.value );
        }
    });
}

/**
 * Definition of a EditorProperty
 */
export interface EditorPropertyInterface
{
    // The displayed label of the rendered input element
    label:string,

    // The type of this property. Decides which kind of input element will be rendered in editor.
    // Can be a predefined entry from EditorPropertyType or a custom angular component which inherits from PropertyInputComponent<C>
    type:Type<PropertyInputComponent<any>>,

    // Possible values for this properties. Only required for EditorPropertyType.SELECT
    values?:{ [key:string]:string };

    // The minimum value (Only required for EditorPropertyType.SLIDER)
    min?:number;
    // The maximum value (Only required for EditorPropertyType.SLIDER)
    max?:number;
    // The interval (Only required for EditorPropertyType.SLIDER)
    interval?:number;

    // Allowed file extensions (Only used by EditorPropertyType.FILE)
    extensions?:Array<string>
}