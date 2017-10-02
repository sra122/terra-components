import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    EventEmitter,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { DndEditorService } from '../dnd-editor.service';
import { Subscription } from 'rxjs/Subscription';
import { EditorComponent } from '../model/dnd-editor-component.interface';
import { ElementDropzoneComponent } from '../element-dropzone/element-dropzone.component';
import { TerraDraggableDirective } from '../../interactables/draggable.directive';
import { DraggableFactory } from '../../interactables/draggable.factory';
import { EditorItem } from '../model/dnd-editor-item.model';
import InteractEvent = Interact.InteractEvent;
import { DND_EDITOR_PROPERTY_METADATA_KEY } from "../index";
import { EditorItemList } from '../model/dnd-editor-item-list.model';
import { OnEditorPropertyChange } from '../model/dnd-editor-property.decorator';

@Component({
    selector: 'dnd-editor-element-container',
    template: require('./element-container.component.html'),
    styles:   [require('./element-container.component.scss')]
})
export class ElementContainerComponent implements OnInit, AfterViewInit, OnDestroy
{
    // editor component assigned to this container
    public editorComponent:EditorComponent;

    // angular component assigned to this container via the editor component
    public editorComponentRef: ComponentRef<any>;

    // editor item containing values of editor properties of the assigend editor component
    public editorItem: EditorItem;

    // emits on every change to the editor item
    public editorItemChange:EventEmitter<EditorItem> = new EventEmitter<EditorItem>();

    // Destroy component by itself. Will be set by parent component after initializing.
    public destroy:() => void;

    // references the element to create instance of assigned editor elements in
    @ViewChild('container', {read: ViewContainerRef})
    private container:ViewContainerRef;

    // Element to add draggable behavior to via DraggableFactory
    @ViewChild( TerraDraggableDirective )
    private draggableElement: TerraDraggableDirective;

    private selected:boolean = false;

    private selectedComponentSubscription:Subscription;


    constructor(public element:ElementRef,
                private editorService:DndEditorService,
                private changeDetector:ChangeDetectorRef,
                private componentFactoryResolver:ComponentFactoryResolver)
    {
    }

    public ngOnInit():void
    {
        this.selectedComponentSubscription =
            this.editorService.selectedComponent.subscribe((container: ElementContainerComponent) =>
            {
                this.selected = container === this;
                this.changeDetector.detectChanges();
            });
    }

    public ngAfterViewInit():void
    {
        // setup draggable behavior
        new DraggableFactory( this.draggableElement )
            .on( "end", (event: InteractEvent) => {
                if((<any>event).dropzone)
                {
                    // destroy component if it has been moved
                    this.destroy();
                }
            });
    }

    /**
     * Create instance of assigned editor component and assign initial values if defined.
     * @param editorComponent   EditorComponent The editor component assign to the container
     * @param editorItem        EditorItem      The item containing the initial values for this instance
     */
    public initEditorElement( editorComponent:EditorComponent, editorItem?:EditorItem ): void
    {
        if( editorItem && editorItem.name !== editorComponent.component.name )
        {
            console.error("EditorItem does not match to EditorComponent");
            return;
        }

        this.editorComponent = editorComponent;
        this.editorItem = editorItem || new EditorItem();

        // create instance of editor component
        this.editorComponentRef = this.container.createComponent(
            this.componentFactoryResolver.resolveComponentFactory( editorComponent.component )
        );

        OnEditorPropertyChange(
            this.editorComponentRef.instance,
            (key: string, value: any) => {
                this.editorItem.properties[key] = value;
                this.editorItemChange.emit( this.editorItem );
            }
        );

        // subscribe to event emitters
        Object.keys( this.editorComponentRef.instance )
              .forEach( ( property: string ) => {
                  if ( this.editorComponentRef.instance[property] instanceof EventEmitter )
                  {
                      this.editorComponentRef.instance[property].substribe( () => {
                          this.editorItemChange.emit( this.editorItem );
                      });
                  }
              });


        if ( editorItem )
        {
            // set initial data if defined
            if( editorItem.properties )
            {
                Object.keys(editorItem.properties)
                      .forEach((property:string) => {
                          this.editorComponentRef.instance[property] = editorItem.properties[property];
                      });
            }

            // render editor component
            this.editorComponentRef.changeDetectorRef.detectChanges();
        }
        else
        {
            // initialize new editor item
            this.editorItem.name = editorComponent.component.name;

            let editorProperties:{[key:string]:any}   = Reflect.getMetadata( DND_EDITOR_PROPERTY_METADATA_KEY, editorComponent.component ) || {};

            Object.keys( editorProperties ).forEach( (property: string) => {
                this.editorItem.properties[property] = this.editorComponentRef.instance[property];
            });
        }

        // select created component
        this.editorService.selectComponent(this);
        this.changeDetector.detectChanges();
    }

    public ngOnDestroy():void
    {
        if(this.selectedComponentSubscription)
        {
            this.selectedComponentSubscription.unsubscribe();
        }
    }

    public selectComponent(event:Event)
    {
        event.stopPropagation();
        this.editorService.selectComponent( this );
    }

    public registerDropzone(dropzone:ElementDropzoneComponent)
    {
        if(this.editorItem && this.editorItem.children.has(dropzone.dropzoneId))
        {
            dropzone.initDropzone(
                this.editorItem.children.get(dropzone.dropzoneId)
            );
        }

        dropzone.itemListChange.subscribe((itemList:EditorItemList) =>
        {
            this.editorItem.children.set(
                dropzone.dropzoneId,
                itemList
            );
            this.editorItemChange.emit(this.editorItem);
        });
    }
}