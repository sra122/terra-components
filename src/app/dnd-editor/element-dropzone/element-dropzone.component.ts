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
import { DndEditorElement } from '../model/dnd-editor-element.interface';
import { DndEditorDocumentItem } from '../model/dnd-editor-document.interface';
import { DropEvent } from '../../interactables/dropEvent.interface';
import { TerraDropzoneDirective } from '../../interactables/dropzone.directive';
import { DropzoneFactory } from '../../interactables/dropzone.factory';

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

    @Output()
    public onDocumentChange:EventEmitter<void> = new EventEmitter<void>();

    @ViewChild(TerraDropzoneDirective)
    private dropzoneElement: TerraDropzoneDirective;

    @ViewChild('dropTarget', {read: ViewContainerRef})
    private dropTarget:ViewContainerRef;

    private childComponents:ComponentRef<ElementContainerComponent>[] = [];

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
        let shadowComponent: ComponentRef<any>;
        this.dragFactory = new DropzoneFactory(
            this.dropzoneElement,
            {
                getPreviewElement: (event: DropEvent) => {
                    if ( event.dropData.documentItem )
                    {
                        return event.relatedTarget;
                    }

                    shadowComponent = this.createComponent(
                        event.dropData.element.component,
                        0
                    );

                    return shadowComponent.location.nativeElement;
                }
            }
        );

        this.dragFactory
            .on("*", () => {
                this.changeDetector.detectChanges();
            })
            .on("reset", () => {
                if ( shadowComponent )
                {
                    shadowComponent.destroy();
                    shadowComponent = null;
                }
            })
            .on("drop", (event: DropEvent, index: number) => {
                this.addEditorElement(
                    event.dropData.element,
                    event.dropData.documentItem,
                    index
                );
            });
    }

    public initDropzone(documentItems:DndEditorDocumentItem[]):void
    {
        documentItems.forEach((docItem:DndEditorDocumentItem, index: number) =>
        {
            this.addEditorElement(
                this.editorService.getEditorElement(docItem.name),
                docItem,
                index
            );
        });
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

    private addEditorElement(element:DndEditorElement, documentItem?:DndEditorDocumentItem, index: number = -1):ComponentRef<ElementContainerComponent>
    {
        let container:ComponentRef<ElementContainerComponent> = this.dropTarget.createComponent(
            this.componentFactory.resolveComponentFactory(ElementContainerComponent),
            index
        );

        this.editorService.currentElementContainer = container.instance;
        container.instance.initEditorElement(element, documentItem);

        container.instance.documentItemChange.subscribe(() =>
        {
            this.onDocumentChange.emit();
        });

        let self = this;
        container.instance.destroy = () =>
        {
            let idx = self.childComponents.indexOf(container);
            self.childComponents.splice(idx, 1);
            container.destroy();
        };

        this.childComponents.push(container);

        this.onDocumentChange.emit();

        return container;
    }

    public getDocumentItems():DndEditorDocumentItem[]
    {
        return this.childComponents.sort(
            (cmpA:ComponentRef<ElementContainerComponent>, cmpB:ComponentRef<ElementContainerComponent>) =>
            {
                return this.dropTarget.indexOf(cmpA.hostView) - this.dropTarget.indexOf(cmpB.hostView);
            }).map((cmp:ComponentRef<ElementContainerComponent>) =>
        {
            return cmp.instance.getDocumentItem();
        });
    }
}