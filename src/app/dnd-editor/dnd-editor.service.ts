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
import { Subject } from 'rxjs/Subject';
import { SectionContainerComponent } from './section-container/section-container.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DndEditorService
{
    public selectedComponentChange: BehaviorSubject<ElementContainerComponent> = new BehaviorSubject(null);
    public selectedSectionChange: BehaviorSubject<SectionContainerComponent> = new BehaviorSubject(null);

    public currentElementContainer:ElementContainerComponent;

    public editorConfig:DndEditorConfig;

    public selectComponent(componentContainer?:ElementContainerComponent)
    {
        if ( this.selectedSectionChange.getValue() )
        {
            this.selectedComponentChange.next( componentContainer );
        }
    }

    public selectSection( sectionContainer?: SectionContainerComponent )
    {
        this.selectedSectionChange.next( sectionContainer );
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