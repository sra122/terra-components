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
    @Input('dnd-editor-dropzoneId')
    public dropzoneId:string;

    @Input('dnd-editor-dropzoneAllow')
    public allowedElements:string;

    public itemList: EditorItemList = new EditorItemList();

    @Output()
    public itemListChange:EventEmitter<EditorItemList> = new EventEmitter<EditorItemList>();

    @ViewChild(TerraDropzoneDirective)
    private dropzoneElement: TerraDropzoneDirective;

    @ViewChild('dropTarget', {read: ViewContainerRef})
    private dropTarget:ViewContainerRef;

    private dragFactory: DropzoneFactory;

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
        this.dragFactory = new DropzoneFactory(
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

        this.dragFactory
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

    public acceptDrop(args:any)
    {
        return true;
        //if(!args.dragData || !args.dragData.element)
        //{
        //    return false;
        //}
        //
        //if(!this.allowedElements)
        //{
        //    return true;
        //}
        //
        //return this.editorService.matchesElementQuery(this.allowedElements, args.dragData.element);
    }

    private createComponent<T>(component:Type<any>, position:number = 0):ComponentRef<T>
    {
        return this.dropTarget.createComponent(
            this.componentFactory.resolveComponentFactory(component),
            position
        );
    }

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