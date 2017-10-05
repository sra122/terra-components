import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { DndEditorService } from '../dnd-editor.service';
import { ElementContainerComponent } from '../element-container/element-container.component';
import { EditorComponent } from '../model/dnd-editor-component.interface';
import { DropEvent } from '../../interactables/dropEvent.interface';
import { TerraDropzoneDirective } from '../../interactables/dropzone.directive';
import { DropzoneFactory } from '../../interactables/dropzone.factory';
import { EditorItemList } from '../model/dnd-editor-item-list.model';
import { EditorItem } from '../model/dnd-editor-item.model';

@Component({
    selector: 'dnd-editor-element-dropzone',
    template: require('./element-dropzone.component.html'),
    styles:   [require('./element-dropzone.component.scss')]
})
export class ElementDropzoneComponent implements OnInit, AfterViewInit
{
    // id of this dropzone. Will be used as key when generating editor document
    @Input('dnd-editor-dropzoneId')
    public dropzoneId:string;

    // TODO: add description
    @Input('dnd-editor-dropzoneAllow')
    public allowedElements:string;

    // ordered list of child editor components assigned to this dropzone
    public itemList: EditorItemList = new EditorItemList();

    // emitted on changes to any child component
    @Output()
    public itemListChange:EventEmitter<EditorItemList> = new EventEmitter<EditorItemList>();

    // references the dropzone element to assign dropzone behavior to
    @ViewChild(TerraDropzoneDirective)
    private dropzoneElement: TerraDropzoneDirective;

    // references the element to add dropped components into.
    @ViewChild('dropTarget', {read: ViewContainerRef})
    private dropTarget:ViewContainerRef;

    // factory for handling default dropzone behavior
    private dropzoneFactory: DropzoneFactory;

    constructor(private editorService:DndEditorService,
                private changeDetector:ChangeDetectorRef,
                private componentFactory:ComponentFactoryResolver)
    {
    }

    public ngOnInit():void
    {
        if(!this.dropzoneId)
        {
            console.error("Property 'dnd-editor-dropzoneId' is mandatory!");
        }

        // register dropzone on current element container.
        // currentElementContainer will be set by addEditorElement() when instantiating new ElementContainerComponents on drop.
        if(this.editorService.currentElementContainer)
        {
            this.editorService.currentElementContainer.registerDropzone(this);
        }
    }

    public ngAfterViewInit():void
    {
        // store reference to generated preview component to destroy on drag end
        let shadowComponent: ComponentRef<any>;

        // setup dropzone behavior
        this.dropzoneFactory = new DropzoneFactory(
            this.dropzoneElement,
            {
                getPreviewElement: (event: DropEvent) => {
                    if ( event.dropData.editorItem )
                    {
                        // element is moved in document => use rendered component instead of creating new instance
                        return event.relatedTarget;
                    }

                    // create instance of dragged editor component to display as previw element
                    shadowComponent = this.createComponent(
                        event.dropData.editorComponent.component,
                        0
                    );

                    return shadowComponent.location.nativeElement;
                }
            }
        );

        this.dropzoneFactory
            .on("*", () => {
                // update view on changes
                this.changeDetector.detectChanges();
            })
            .on("reset", () => {
                if ( shadowComponent )
                {
                    // destroy component created for displaying drop preview
                    shadowComponent.destroy();
                    shadowComponent = null;
                }
            })
            .on("drop", (event: DropEvent, index: number) => {
                // place new element
                this.addEditorElement(
                    event.dropData.editorComponent,
                    event.dropData.editorItem,
                    index
                );
            });
    }

    /**
     * Initialize child components and assign property values
     * @param itemList EditorItemList   Ordered list of child components
     */
    public initDropzone( itemList: EditorItemList ):void
    {
        this.itemList = itemList;
        this.itemList.items.forEach(
            (item: EditorItem, index: number) => {
                this.addEditorElement(
                    this.editorService.getEditorElement( item.name ),
                    item,
                    index
                );
            }
        );
    }

    /**
     * Check if element can be dropped in this dropzone
     * @param args
     * @returns {boolean}
     */
    public acceptDrop(args:any)
    {
        if(!args.dragData || !args.dragData.editorComponent)
        {
            // dragged element is not a editor component
            return false;
        }

        if(!this.allowedElements)
        {
            // allowed elements are not defined so all elements are allowed.
            return true;
        }

        // check if dropped element is allowed
        return this.editorService.matchesElementQuery(this.allowedElements, args.dragData.editorComponent);
    }

    /**
     * Create a new instance of an angular component. Instance will be created in 'dropTarget'-Element at defined position
     * @param component     Type<any>   The angular component to create instance of
     * @param position      number      The position to insert component element at.
     * @returns {ComponentRef<C>}       The instance of the created component
     */
    private createComponent<T>(component:Type<any>, position:number = 0):ComponentRef<T>
    {
        return this.dropTarget.createComponent(
            this.componentFactory.resolveComponentFactory(component),
            position
        );
    }

    /**
     * Add a new editor component at defined position and assign initial property values.
     * Instance of EditorComponent will be wrapped in ElementContainerComponent.
     * @param editorComponent   EditorComponent     The editor component to create instance of.
     * @param editorItem        EditorItem          Editor item containing initial property values of created component
     * @param index             number              The position to insert created component at.
     * @returns {ComponentRef<ElementContainerComponent>}
     */
    private addEditorElement(editorComponent:EditorComponent, editorItem?:EditorItem, index: number = -1):ComponentRef<ElementContainerComponent>
    {
        // create container to wrap editor component
        let container: ComponentRef<ElementContainerComponent> = this.dropTarget.createComponent(
            this.componentFactory.resolveComponentFactory(ElementContainerComponent),
            index
        );

        // subscribe to changes on editor properties
        container.instance.editorItemChange.subscribe((editorItem: EditorItem) =>
        {
            this.itemList.set( editorItem, index );
            this.itemListChange.emit( this.itemList );
        });

        // set function to destroy container
        container.instance.destroy = () =>
        {
            container.destroy();
        };

        // store created container instance
        // dropzone inside the assigned editor component will be registered on this container
        this.editorService.currentElementContainer = container.instance;

        // render editor component in created container and optionally set initial values
        container.instance.initEditorElement(editorComponent, editorItem);


        this.itemList.add( container.instance.editorItem, index );
        this.itemListChange.emit( this.itemList );

        return container;
    }
}