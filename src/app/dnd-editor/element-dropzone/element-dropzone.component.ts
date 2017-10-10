import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    EventEmitter,
    forwardRef,
    Host,
    Inject,
    Input,
    OnDestroy,
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
import { SectionContainerComponent } from '../section-container/section-container.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'dnd-editor-element-dropzone',
    template: require('./element-dropzone.component.html'),
    styles:   [require('./element-dropzone.component.scss')]
})
export class ElementDropzoneComponent implements OnInit, AfterViewInit, OnDestroy
{

    // id of this dropzone. Will be used as key when generating editor document
    @Input('dnd-editor-dropzoneId')
    public dropzoneId:string;

    // TODO: add description
    @Input('dnd-editor-dropzoneAllow')
    public allowedElements:string;

    // ordered list of child editor components assigned to this dropzone
    private _itemList: EditorItemList;

    public get itemList(): EditorItemList
    {
        if ( !this._itemList )
        {
            this.itemList = new EditorItemList();
        }
        return this._itemList;
    }

    public set itemList( list: EditorItemList )
    {
        if ( this.itemListSubscription )
        {
            this.itemListSubscription.unsubscribe();
            this.itemListSubscription = null;
        }

        this._itemList = list;
        if ( this._itemList )
        {
            this.itemListSubscription = this._itemList.onChange.subscribe( () => {
                this.changeDetector.detectChanges();
            });
        }
    }

    private itemListSubscription: Subscription;

    // references the dropzone element to assign dropzone behavior to
    @ViewChild(TerraDropzoneDirective)
    private dropzoneElement: TerraDropzoneDirective;

    // references the element to add dropped components into.
    @ViewChild('dropTarget', {read: ViewContainerRef})
    private dropTarget:ViewContainerRef;

    // factory for handling default dropzone behavior
    private dropzoneFactory: DropzoneFactory;

    private isSectionSelected: boolean = false;
    private selectedSectionSubscription: Subscription;


    constructor(private editorService:DndEditorService,
                private changeDetector:ChangeDetectorRef,
                private componentFactory:ComponentFactoryResolver,
                @Inject(forwardRef(() => ElementContainerComponent)) private parent: ElementContainerComponent,
                @Inject(forwardRef(() => SectionContainerComponent)) private parentSection: SectionContainerComponent
    )
    {
    }

    public ngOnInit():void
    {
        if(!this.dropzoneId)
        {
            console.error("Property 'dnd-editor-dropzoneId' is mandatory!");
        }

        if ( this.parent )
        {
            let itemList = this.parent.editorItem.children.get( this.dropzoneId );
            if ( itemList )
            {
                this.initDropzone( itemList );
            }
        }

        this.selectedSectionSubscription = this.editorService.selectedSectionChange.subscribe( (section: SectionContainerComponent) => {
            this.isSectionSelected = (section && section === this.parentSection)
                                     || (!section && !this.parentSection && this.editorService.editorConfig.allowRootSection );
        });
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

    public ngOnDestroy():void
    {
        if ( this.itemListSubscription )
        {
            this.itemListSubscription.unsubscribe();
        }

        if ( this.selectedSectionSubscription )
        {
            this.selectedSectionSubscription.unsubscribe();
        }
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
                if ( item.isSection )
                {
                    this.addEditorSection(
                        item,
                        index
                    );
                }
                else
                {
                    this.addEditorElement(
                        this.editorService.getEditorElement( item.name ),
                        item,
                        index
                    );
                }
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
        if ( !this.isSectionSelected )
        {
            return false;
        }

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


        // set function to destroy container
        container.instance.destroy = () =>
        {
            this.itemList.remove( editorItem );
            container.destroy();
        };

        // render editor component in created container and optionally set initial values
        container.instance.initEditorElement(editorComponent, editorItem);

        if ( !this.itemList.contains( container.instance.editorItem ) )
        {
            // add editor item to document tree if not exists
            this.itemList.add( container.instance.editorItem, index );
        }

        return container;
    }

    private addEditorSection( editorItem: EditorItem, index: number = -1): ComponentRef<SectionContainerComponent>
    {
        let container: ComponentRef<SectionContainerComponent> = this.dropTarget.createComponent(
            this.componentFactory.resolveComponentFactory(SectionContainerComponent),
            index
        );

        container.instance.editorItem = editorItem;

        return container;
    }
}