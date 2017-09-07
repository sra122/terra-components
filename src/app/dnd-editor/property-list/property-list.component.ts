import {
    Component,
    ComponentRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { DndEditorElement } from '../model/dnd-editor-element.interface';
import {
    DND_EDITOR_PROPERTY_METADATA_KEY,
    DndEditorElementProperty
} from '../model/dnd-editor-element-property.decorator';

@Component({
    selector: 'dnd-editor-property-list',
    template: require('./property-list.component.html'),
    styles:   [require('./property-list.component.scss')]
})
export class PropertyListComponent implements OnChanges
{

    @Input()
    public component:ComponentRef<any>;

    @Input()
    public editorElement:DndEditorElement;

    @Output()
    public componentChange:EventEmitter<ComponentRef<any>> = new EventEmitter<ComponentRef<any>>();

    private elementProperties:{ [key:string]:DndEditorElementProperty };

    private elementPropertyKeys:string[];

    public ngOnChanges(changes:SimpleChanges):void
    {
        if(changes.hasOwnProperty("editorElement"))
        {
            this.elementProperties = Reflect.getMetadata(
                DND_EDITOR_PROPERTY_METADATA_KEY,
                this.editorElement.component
            );

            this.elementPropertyKeys = Object.keys(this.elementProperties || {})
                                             .filter( (property: string) => {
                                                 return !!this.elementProperties[property];
                                             });
        }
    }

    private isList(propertyKey:string)
    {
        return Reflect.getMetadata("design:type", this.editorElement.component, propertyKey) === Array;
    }

    private setPropertyValue(propertyKey:string, propertyValue:any)
    {
        this.component.instance[propertyKey] = propertyValue;
        this.component.changeDetectorRef.detectChanges();
        this.componentChange.emit(this.component);
    }
}