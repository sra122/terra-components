import {
    ComponentRef,
    Injectable
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ElementContainerComponent } from './element-container/element-container.component';
import { EditorComponent } from './model/dnd-editor-component.interface';
import {
    DndEditorConfig,
    PlaceholderMap
} from './model/dnd-editor-config.interface';
import { EditorHelper } from './helper/editor.helper';

@Injectable()
export class DndEditorService
{
    public selectedComponent:Observable<ElementContainerComponent>;
    private selectedComponentValue:ElementContainerComponent;
    private selectedComponentListeners:Observer<ElementContainerComponent>[] = [];

    public currentElementContainer:ElementContainerComponent;

    public editorConfig:DndEditorConfig;

    constructor()
    {
        this.selectedComponent = new Observable((observer:Observer<ElementContainerComponent>) =>
        {
            this.selectedComponentListeners.push(observer);
            observer.next(this.selectedComponentValue);
            return () =>
            {
                let idx = this.selectedComponentListeners.indexOf(observer);
                this.selectedComponentListeners.splice(idx, 1);
            };
        });
    }

    public selectComponent(componentContainer?:ElementContainerComponent)
    {
        this.selectedComponentValue = componentContainer;
        this.selectedComponentListeners
            .forEach((listener:Observer<ElementContainerComponent>) =>
            {
                listener.next(componentContainer);
            });
    }

    public getEditorElement(elementName:string):EditorComponent
    {
        for(let i = 0; i < this.editorConfig.componentGroups.length; i++)
        {
            for(let j = 0; j < this.editorConfig.componentGroups[i].components.length; j++)
            {
                if(this.editorConfig.componentGroups[i].components[j].component.name === elementName)
                {
                    return this.editorConfig.componentGroups[i].components[j];
                }
            }
        }

        return null;
    }

    public matchesElementQuery(query:string, element:EditorComponent):boolean
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