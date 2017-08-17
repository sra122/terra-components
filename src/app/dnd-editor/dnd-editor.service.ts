import { ComponentRef, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { ElementContainerComponent } from "./element-container/element-container.component";
import { DndEditorElement } from "./model/dnd-editor-element.interface";
import { DndEditorConfig } from "./model/dnd-editor-config.interface";
import { EditorHelper } from "./helper/editor.helper";

@Injectable()
export class DndEditorService
{
    public selectedComponent: Observable<ComponentRef<any>>;
    private selectedComponentListeners: Observer<ComponentRef<any>>[] = [];

    public currentElementContainer: ElementContainerComponent;

    public editorConfig: DndEditorConfig;

    public hoveredElementContainer: ElementContainerComponent;
    private lastHoverEvent: Event;

    constructor()
    {
        this.selectedComponent = new Observable( (observer: Observer<ComponentRef<any>>) => {
            this.selectedComponentListeners.push( observer );
            return () => {
                let idx = this.selectedComponentListeners.indexOf( observer );
                this.selectedComponentListeners.splice( idx, 1 );
            };
        });
    }

    public selectComponent( component?: ComponentRef<any> )
    {
        this.selectedComponentListeners
            .forEach( (listener: Observer<ComponentRef<any>>) => {
                listener.next( component );
            });
    }

    public getEditorElement( elementName: string ): DndEditorElement
    {
        for ( let i = 0; i < this.editorConfig.elementGroups.length; i++ )
        {
            for( let j = 0; j < this.editorConfig.elementGroups[i].elements.length; i++ )
            {
                if ( this.editorConfig.elementGroups[i].elements[j].component.name === elementName )
                {
                    return this.editorConfig.elementGroups[i].elements[j];
                }
            }
        }

        return null;
    }

    public hoverElementContainer( container: ElementContainerComponent, event: Event )
    {
        if ( event !== this.lastHoverEvent )
        {
            this.hoveredElementContainer = container;
            this.lastHoverEvent = event;
        }
    }

    public matchesElementQuery( query: string, element: DndEditorElement ): boolean
    {
        let helper = new EditorHelper( this.editorConfig );
        return helper.matchesQuery( query, element );
    }
}