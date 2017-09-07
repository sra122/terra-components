import {
    ComponentRef,
    Injectable
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ElementContainerComponent } from './element-container/element-container.component';
import { DndEditorElement } from './model/dnd-editor-element.interface';
import {
    DndEditorConfig,
    PlaceholderMap
} from './model/dnd-editor-config.interface';
import { EditorHelper } from './helper/editor.helper';

@Injectable()
export class DndEditorService
{
    public static propertyChange: Observable<void>;
    public static propertyChangeListeners: Array<Observer<void>> = [];
    public selectedComponent:Observable<ComponentRef<any>>;
    private selectedComponentValue:ComponentRef<any>;
    private selectedComponentListeners:Observer<ComponentRef<any>>[] = [];

    public currentElementContainer:ElementContainerComponent;

    public editorConfig:DndEditorConfig;

    public hoveredElementContainer:ElementContainerComponent;
    private lastHoverEvent:Event;

    constructor()
    {
        this.selectedComponent = new Observable((observer:Observer<ComponentRef<any>>) =>
        {
            this.selectedComponentListeners.push(observer);
            observer.next(this.selectedComponentValue);
            return () =>
            {
                let idx = this.selectedComponentListeners.indexOf(observer);
                this.selectedComponentListeners.splice(idx, 1);
            };
        });

        DndEditorService.propertyChange = new Observable( (observer: Observer<void>) => {
            DndEditorService.propertyChangeListeners.push( observer );
            return () => {
                let idx: number = DndEditorService.propertyChangeListeners.indexOf( observer );
                DndEditorService.propertyChangeListeners.splice( idx, 1 );
            }
        })
    }

    public static onPropertyChange( target: Object, property: string, oldValue: any, newValue: any )
    {
        DndEditorService.propertyChangeListeners.forEach( (listener: Observer<void>) => {
            listener.next(null);
        });
    }

    public selectComponent(component?:ComponentRef<any>)
    {
        this.selectedComponentValue = component;
        this.selectedComponentListeners
            .forEach((listener:Observer<ComponentRef<any>>) =>
            {
                listener.next(component);
            });
    }

    public getEditorElement(elementName:string):DndEditorElement
    {
        for(let i = 0; i < this.editorConfig.elementGroups.length; i++)
        {
            for(let j = 0; j < this.editorConfig.elementGroups[i].elements.length; j++)
            {
                if(this.editorConfig.elementGroups[i].elements[j].component.name === elementName)
                {
                    return this.editorConfig.elementGroups[i].elements[j];
                }
            }
        }

        return null;
    }

    public hoverElementContainer(container:ElementContainerComponent, event:Event)
    {
        if(event !== this.lastHoverEvent)
        {
            this.hoveredElementContainer = container;
            this.lastHoverEvent = event;
        }
    }

    public matchesElementQuery(query:string, element:DndEditorElement):boolean
    {
        let helper = new EditorHelper(this.editorConfig);
        return helper.matchesQuery(query, element);
    }

    public getPlaceholderName(placeholder:string):string
    {
        let query = placeholder.split(".");
        if(query[0] === "root")
        {
            query.shift();
        }

        let key = query.shift();
        let placeholderMap = this.editorConfig.placeholder;
        while(key && placeholderMap && placeholderMap[key])
        {
            placeholderMap = <PlaceholderMap>placeholderMap[key];
            key = query.shift();
        }

        if(typeof placeholderMap !== "string")
        {
            console.warn("Cannot get name for placeholder: " + placeholder);
            return placeholder;
        }

        return placeholderMap;
    }

    public isPlaceholder(placeholder:string):boolean
    {
        let query = placeholder.split(".");
        if(query[0] === "root")
        {
            query.shift();
        }

        let key = query.shift();
        let placeholderMap = this.editorConfig.placeholder;
        while(key && placeholderMap && placeholderMap[key])
        {
            placeholderMap = <PlaceholderMap>placeholderMap[key];
            key = query.shift();
        }

        return typeof placeholderMap === "string";
    }
}