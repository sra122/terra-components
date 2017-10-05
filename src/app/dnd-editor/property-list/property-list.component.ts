import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import {
    DND_EDITOR_PROPERTY_METADATA_KEY,
    EditorPropertyInterface
} from '../model/dnd-editor-property.decorator';
import { ElementContainerComponent } from '../element-container/element-container.component';

@Component({
    selector: 'dnd-editor-property-list',
    template: require('./property-list.component.html'),
    styles:   [require('./property-list.component.scss')]
})
export class PropertyListComponent implements OnChanges
{
    // The element container to display editor properties for
    @Input()
    public elementContainer:ElementContainerComponent;

    // Map of editor properties assigned to the current element container
    private elementProperties:{ [key:string]:EditorPropertyInterface };

    // List of property keys
    private elementPropertyKeys:string[];

    public ngOnChanges(changes:SimpleChanges):void
    {
        // get element properties for current element container
        if(changes.hasOwnProperty("elementContainer"))
        {
            this.elementProperties = Reflect.getMetadata(
                DND_EDITOR_PROPERTY_METADATA_KEY,
                this.elementContainer.editorComponent.component
            );

            this.elementPropertyKeys = Object.keys(this.elementProperties || {})
                                             .filter( (property: string) => {
                                                 return !!this.elementProperties[property];
                                             });
        }
    }

    /**
     * Check if decorated property is an array and a list of input components should be rendered
     * @param propertyKey
     * @returns {boolean}
     */
    private isList(propertyKey:string)
    {
        return Reflect.getMetadata("design:type", this.elementContainer.editorComponent.component, propertyKey) === Array;
    }

    /**
     * Get the value of an editor property by its key
     * @param propertyKey
     * @returns {any}
     */
    private getPropertyValue( propertyKey: string ): any
    {
        return this.elementContainer.editorItem.properties[propertyKey];
    }

    /**
     * Set the value of an editor property by its key
     * @param propertyKey
     * @param propertyValue
     */
    private setPropertyValue(propertyKey:string, propertyValue:any)
    {
        this.elementContainer.editorComponentRef.instance[propertyKey] = propertyValue;
    }
}