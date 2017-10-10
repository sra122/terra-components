import {
    ChangeDetectorRef,
    Component,
    ComponentRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { PlaceholderMap } from '../model/dnd-editor-config.interface';
import { DndEditorService } from '../dnd-editor.service';
import { Subscription } from 'rxjs/Subscription';
import { ElementContainerComponent } from '../element-container/element-container.component';

@Component({
    selector: 'dnd-editor-placeholder-list',
    template: require('./placeholder-list.component.html'),
    styles:   [require('./placeholder-list.component.scss')]
})
export class PlaceholderListComponent implements OnInit, OnChanges, OnDestroy
{
    // definitions of available placeholders
    @Input()
    public placeholderMap:PlaceholderMap;

    // current scope to display placeholders for.
    // "root" is a pseudo-scope and does not have to be defined in the editor config.
    // If editor config contains a scope "root" the correct value would be "root.root"
    //
    // Example: "root.foo" will allow all placeholders in root AND all placeholders in foo
    // "root.foo.bar" will allow all placeholders in root, foo and bar
    @Input()
    public scope:string = "root";

    // flat list of all available placeholders in current scope
    public placeholderList:Array<[string, string]> = [];

    // position of the caret while dragging placeholders
    public caretPos:{ x:number, y:number, height:number } = null;

    // dragged placeholder element
    private draggedElement:HTMLElement;

    // position of the dragged placeholder element
    private draggedElementPos:{ x:number, y:number };

    // selected editor item: Dropping placeholders should only be allowed on currently selected item.
    private selectedComponent:ElementContainerComponent;

    // subscription to selected editor component. Should be unsubscibed on destroy to avoid calling detectChanges() on destroyed views.
    private selectedComponentSubscription:Subscription;

    constructor(private editorService:DndEditorService, private changeDetector:ChangeDetectorRef)
    {
    }

    public ngOnInit():void
    {
        // subscribe to selected component
        this.selectedComponentSubscription = this.editorService.selectedComponentChange.subscribe(componentRef =>
        {
            this.selectedComponent = componentRef;
            this.changeDetector.detectChanges();
        });
    }

    public ngOnChanges(changes:SimpleChanges):void
    {
        // calculate available placeholders when changing the scope or the definition of placeholders in the editor config
        if(( changes.hasOwnProperty("scope") || changes.hasOwnProperty("placeholderMap") ) && this.placeholderMap)
        {
            // resolve scope string
            let scopes:string[] = (this.scope || "root" )
                .split(".")
                .map(scope => scope.toLowerCase());

            if(scopes[0] === "root")
            {
                // remove "root" from scopes
                scopes.shift();
            }

            this.placeholderList = this.getPlaceholdersForScope(this.placeholderMap, scopes);
        }
    }

    public ngOnDestroy():void
    {
        // unsubscribe from subscriptions to avoid calling detectChanges() on destroyed views.
        if(this.selectedComponentSubscription)
        {
            this.selectedComponentSubscription.unsubscribe();
        }
    }

    /**
     * Map placeholders from nested map in editor config to flat list depending on a defined scope.
     * @param placeholderMap    PlaceholderMap      Definition of available placeholders from editor config
     * @param scopes            string[]            Descending list of scopes (should not contain pseudo-scope "root")
     * @returns {Array<[string,string]>}
     */
    private getPlaceholdersForScope(placeholderMap:PlaceholderMap, scopes:string[]):Array<[string, string]>
    {
        let result:Array<[string, string]> = [];

        // get first child scope from list
        let nextScope:string = scopes.shift();

        Object.keys(placeholderMap).forEach((key:string) =>
        {
            // check if property is a placeholder
            if(typeof placeholderMap[key] === "string")
            {
                // store placeholder in results
                result.push([key, <string> placeholderMap[key]]);
            }
            else
            {
                // property is a nested list of placeholders => check if list is in scope
                if(key === nextScope)
                {
                    // get placeholders for child scope
                    result = result.concat(
                        this.getPlaceholdersForScope(<PlaceholderMap> placeholderMap[key], scopes)
                            .map((placeholderEntry:[string, string]) =>
                            {
                                // prepent parent scopes to placeholder key, e.g. "bar" in "foo" becomes "foo.bar"
                                placeholderEntry[0] = key + "." + placeholderEntry[0];
                                return placeholderEntry;
                            })
                    );
                }
            }

        });

        return result;
    }

    /**
     * Handle drag start of placeholder elements
     * @param event
     */
    public onStart(event:Interact.InteractEvent)
    {
        if(this.draggedElement)
        {
            console.error("Drag already in progress.");
        }

        this.draggedElement = event.target.cloneNode(true);
        document.body.appendChild(this.draggedElement);

        let clientRect:ClientRect = event.target.getBoundingClientRect();
        this.draggedElement.style.width = clientRect.width + 'px';
        this.draggedElement.style.height = clientRect.height + 'px';
        this.draggedElement.classList.add("draggable-clone");


        this.draggedElementPos = {
            x: clientRect.left,
            y: clientRect.top
        };
    }

    /**
     * Handle drag move of placeholder elements: Move dragged placeholder or display caret if element is dragged over placeholder-dropzone
     * @param event
     */
    public onMove(event:Interact.InteractEvent)
    {
        let dropzone = (<any>event).dropzone;
        if(this.selectedComponent && dropzone && this.selectedComponent.element.nativeElement.contains(dropzone._element))
        {
            // element is dragged over placeholder dropzone inside to currently selected editor component
            // => display caret at insert position
            let range:Range = document.caretRangeFromPoint(event.clientX, event.clientY);
            this.caretPos = {
                x:      range.getBoundingClientRect().left,
                y:      range.getBoundingClientRect().top,
                height: range.getBoundingClientRect().height
            };
            if(this.draggedElement)
            {
                // hide dragged placeholder element while displaying caret
                this.draggedElement.classList.add("hidden");
            }
        }
        else
        {
            // element is dragged "anywhere"
            this.caretPos = null;
            if(this.draggedElement)
            {
                // show dragged placeholder element
                this.draggedElement.classList.remove("hidden");
            }
        }

        // set new position of dragged placeholder element
        if(this.draggedElement)
        {
            this.draggedElementPos.x += event.dx;
            this.draggedElementPos.y += event.dy;
            this.draggedElement.style.left = this.draggedElementPos.x + 'px';
            this.draggedElement.style.top = this.draggedElementPos.y + 'px';
        }
    }

    /**
     * Handle end of drag by removing caret and dragged element.
     * @param event
     */
    public onEnd(event:Interact.InteractEvent)
    {
        this.caretPos = null;
        if(this.draggedElement)
        {
            this.draggedElement.remove();
            this.draggedElement = null;
        }
    }
}