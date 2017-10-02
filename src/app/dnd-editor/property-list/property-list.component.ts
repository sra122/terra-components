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

    @Input()
    public elementContainer:ElementContainerComponent;

    private elementProperties:{ [key:string]:EditorPropertyInterface };

    private elementPropertyKeys:string[];

    public ngOnChanges(changes:SimpleChanges):void
    {
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

    private isList(propertyKey:string)
    {
        return Reflect.getMetadata("design:type", this.elementContainer.editorComponent.component, propertyKey) === Array;
    }

    private getPropertyValue( propertyKey: string ): any
    {
        return this.elementContainer.editorItem.properties[propertyKey];
    }

    private setPropertyValue(propertyKey:string, propertyValue:any)
    {
        this.elementContainer.editorComponentRef.instance[propertyKey] = propertyValue;
    }
}