import {
    ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, EventEmitter, forwardRef, Inject, Input,
    OnInit,
    Output,
    QueryList, Type,
    ViewChild,
    ViewChildren,
    ViewContainerRef
} from "@angular/core";
import { DropEvent } from "../../ng2-interact/dropEvent.interface";
import { DndEditorService } from "../dnd-editor.service";
import { ElementContainerComponent } from "../element-container/element-container.component";
import { DndEditorElement } from "../model/dnd-editor-element.interface";
import { DND_EDITOR_PROPERTY_METADATA_KEY } from "../model/dnd-editor-element-property.decorator";
import { DndEditorDocumentItem } from "../model/dnd-editor-document.interface";

@Component({
    selector: 'dnd-editor-element-dropzone',
    template: require('./element-dropzone.component.html'),
    styles: [require('./element-dropzone.component.scss')]
})
export class ElementDropzoneComponent implements OnInit
{

    @Input('dnd-editor-dropzoneId')
    public dropzoneId: string;

    @Input('dnd-editor-dropzoneAllow')
    public allowedElements: string;

    @Output()
    public onDocumentChange: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('dropTarget', { read: ViewContainerRef })
    private dropTarget: ViewContainerRef;

    public isDragActive: boolean = false;
    public isDragOver: boolean = false;

    private childComponents: ComponentRef<ElementContainerComponent>[] = [];
    private insertIndex: number = 0;
    private shadowComponent: ComponentRef<any>;


    constructor(
        private editorService: DndEditorService,
        private changeDetector: ChangeDetectorRef,
        private componentFactory: ComponentFactoryResolver
    )
    {
    }

    public ngOnInit(): void
    {
        if ( !this.dropzoneId )
        {
            console.error( "Property 'dnd-editor-dropzoneId' is mandatory!" );
        }
        if ( this.editorService.currentElementContainer )
        {
            this.editorService.currentElementContainer.registerDropzone( this );
        }
    }

    public initDropzone( documentItems: DndEditorDocumentItem[] ): void
    {
        documentItems.forEach( (docItem: DndEditorDocumentItem) => {
            this.addEditorElement(
                this.editorService.getEditorElement( docItem.name ),
                docItem
            );
        });
    }

    public onDragActivate()
    {
        this.isDragActive = true;
        this.changeDetector.detectChanges();
    }

    public onDragEnter( event: DropEvent )
    {
        this.isDragOver = true;
        this.changeDetector.detectChanges();
    }

    public onDragMove( event: DropEvent )
    {
       let insertIndex = this.childComponents.findIndex(
           (component: ComponentRef<any>) => {
               let rect: ClientRect = component.location.nativeElement.getBoundingClientRect();
               return rect.left <= event.dragEvent.clientX
                   && rect.right >= event.dragEvent.clientX
                   && rect.top <= event.dragEvent.clientY
                   && rect.bottom >= event.dragEvent.clientY;
           }
       );

       if ( insertIndex >= 0 )
       {
           let insertRect: ClientRect = this.childComponents[insertIndex].location.nativeElement.getBoundingClientRect();
           let elementGradient = ( insertRect.right - insertRect.left ) / ( insertRect.bottom - insertRect.top );
           let cursorGradient = ( event.dragEvent.clientX - insertRect.left ) / ( event.dragEvent.clientY - insertRect.top );
           if ( elementGradient >= cursorGradient )
           {
               insertIndex++;
           }

           if ( insertIndex != this.insertIndex )
           {
               this.insertIndex = insertIndex;
               if ( this.shadowComponent )
               {
                   this.dropTarget.move( this.shadowComponent.hostView, this.insertIndex );
               }
               else
               {
                   this.editorService.currentElementContainer = null;
                   this.shadowComponent = this.createComponent(
                       event.dropData.element.component,
                       this.insertIndex,
                   );
                   this.shadowComponent.location.nativeElement.classList.add('shadow-clone');
               }
               this.changeDetector.detectChanges();
           }
       }
       else
       {
           if ( !this.shadowComponent )
           {
               this.editorService.currentElementContainer = null;
               this.shadowComponent = this.createComponent( event.dropData.element.component );
               this.shadowComponent.location.nativeElement.classList.add('shadow-clone');
               this.changeDetector.detectChanges();
           }
       }
    }

    public onDragLeave()
    {
        if ( this.shadowComponent )
        {
            this.shadowComponent.destroy();
            this.shadowComponent = null;
            this.insertIndex = -1;
        }
        this.isDragOver = false;
        this.changeDetector.detectChanges();
    }

    public onDragDeactivate()
    {
        this.isDragActive = false;
        this.changeDetector.detectChanges();
    }

    public onDrop( event: DropEvent )
    {
        this.addEditorElement( event.dropData.element );

        // trigger "dragLeave" manually because it's not triggered by interact
        this.onDragLeave();
    }

    public acceptDrop( args: any )
    {
        if ( !args.dragData || !args.dragData.element )
        {
            return false;
        }

        if ( !this.allowedElements )
        {
            return true;
        }

        return this.editorService.matchesElementQuery( this.allowedElements, args.dragData.element );
    }

    private createComponent<T>( component: Type<any>, position: number = 0 ): ComponentRef<T>
    {
        return this.dropTarget.createComponent(
            this.componentFactory.resolveComponentFactory( component ),
            position
        );
    }

    private addEditorElement( element: DndEditorElement, documentItem?: DndEditorDocumentItem ): ComponentRef<ElementContainerComponent>
    {
        let container: ComponentRef<ElementContainerComponent> = this.dropTarget.createComponent(
            this.componentFactory.resolveComponentFactory( ElementContainerComponent ),
            this.insertIndex
        );

        this.editorService.currentElementContainer = container.instance;
        container.instance.initEditorElement( element, documentItem );

        container.instance.documentItemChange.subscribe( () => {
            this.onDocumentChange.emit();
        });

        let self = this;
        container.instance.destroy = () => {
            let idx = self.childComponents.indexOf( container );
            self.childComponents.splice( idx, 1 );
            container.destroy();
        };

        this.childComponents.push( container );

        this.onDocumentChange.emit();

        return container;
    }

    public getDocumentItems(): DndEditorDocumentItem[]
    {
        return this.childComponents.sort(
            (cmpA: ComponentRef<ElementContainerComponent>, cmpB: ComponentRef<ElementContainerComponent>) => {
            return this.dropTarget.indexOf( cmpA.hostView ) - this.dropTarget.indexOf( cmpB.hostView );
        }).map( (cmp: ComponentRef<ElementContainerComponent>) => {
            return cmp.instance.getDocumentItem();
        });
    }
}