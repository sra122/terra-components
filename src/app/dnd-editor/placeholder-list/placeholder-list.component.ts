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

@Component({
    selector: 'dnd-editor-placeholder-list',
    template: require('./placeholder-list.component.html'),
    styles:   [require('./placeholder-list.component.scss')]
})
export class PlaceholderListComponent implements OnInit, OnChanges, OnDestroy
{
    @Input()
    public placeholderMap:PlaceholderMap;

    @Input()
    public scope:string = "root";

    public placeholderList:Array<[string, string]> = [];

    public caretPos:{ x:number, y:number, height:number } = null;
    private draggedElement:HTMLElement;
    private draggedElementPos:{ x:number, y:number };

    private selectedComponent:ComponentRef<any>;
    private selectedComponentSubscription:Subscription;

    constructor(private editorService:DndEditorService, private changeDetector:ChangeDetectorRef)
    {
    }

    public ngOnInit():void
    {
        this.selectedComponentSubscription = this.editorService.selectedComponent.subscribe(componentRef =>
        {
            this.selectedComponent = componentRef;
            this.changeDetector.detectChanges();
        });
    }

    public ngOnChanges(changes:SimpleChanges):void
    {
        if(( changes.hasOwnProperty("scope") || changes.hasOwnProperty("placeholderMap") ) && this.placeholderMap)
        {
            let scopes:string[] = (this.scope || "root" )
                .split(".")
                .map(scope => scope.toLowerCase());

            if(scopes[0] === "root")
            {
                scopes.shift();
            }

            this.placeholderList = this.getPlaceholdersForScope(this.placeholderMap, scopes);
        }
    }

    public ngOnDestroy():void
    {
        if(this.selectedComponentSubscription)
        {
            this.selectedComponentSubscription.unsubscribe();
        }
    }

    private getPlaceholdersForScope(placeholderMap:PlaceholderMap, scopes:string[]):Array<[string, string]>
    {
        let result:Array<[string, string]> = [];
        let nextScope:string = scopes.shift();

        Object.keys(placeholderMap).forEach((key:string) =>
        {
            if(typeof placeholderMap[key] === "string")
            {
                result.push([key,
                             <string> placeholderMap[key]]);
            }
            else
            {
                if(key === nextScope)
                {
                    result = result.concat(
                        this.getPlaceholdersForScope(<PlaceholderMap> placeholderMap[key], scopes)
                            .map((placeholderEntry:[string, string]) =>
                            {
                                placeholderEntry[0] = key + "." + placeholderEntry[0];
                                return placeholderEntry;
                            })
                    );
                }
            }

        });

        return result;
    }

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

    public onMove(event:Interact.InteractEvent)
    {
        let dropzone = (<any>event).dropzone;
        if(this.selectedComponent && dropzone && this.selectedComponent.location.nativeElement.contains(dropzone._element))
        {
            let range:Range = document.caretRangeFromPoint(event.clientX, event.clientY);
            this.caretPos = {
                x:      range.getBoundingClientRect().left,
                y:      range.getBoundingClientRect().top,
                height: range.getBoundingClientRect().height
            };
            if(this.draggedElement)
            {
                this.draggedElement.classList.add("hidden");
            }
        }
        else
        {
            this.caretPos = null;
            if(this.draggedElement)
            {
                this.draggedElement.classList.remove("hidden");
            }
        }

        if(this.draggedElement)
        {
            this.draggedElementPos.x += event.dx;
            this.draggedElementPos.y += event.dy;
            this.draggedElement.style.left = this.draggedElementPos.x + 'px';
            this.draggedElement.style.top = this.draggedElementPos.y + 'px';
        }
    }

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