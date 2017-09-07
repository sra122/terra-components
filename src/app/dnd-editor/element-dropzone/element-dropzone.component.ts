import {
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

@Component({
    selector: 'dnd-editor-element-dropzone',
    template: require('./element-dropzone.component.html'),
    styles:   [require('./element-dropzone.component.scss')]
})
export class ElementDropzoneComponent implements OnInit
{

    @Input('dnd-editor-dropzoneId')
    public dropzoneId:string;

    @Input('dnd-editor-dropzoneAllow')
    public allowedElements:string;

    @Output()
    public onDocumentChange:EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('dropTarget', {read: ViewContainerRef})
    private dropTarget:ViewContainerRef;

    public isDragActive:boolean = false;
    public isDragOver:boolean = false;

    private childComponents:ComponentRef<ElementContainerComponent>[] = [];
    private insertIndex:number = 0;
    private shadowComponent:ComponentRef<any>;


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

    public initDropzone(documentItems:DndEditorDocumentItem[]):void
    {
        documentItems.forEach((docItem:DndEditorDocumentItem, index: number) =>
        {
            this.insertIndex = index;
            this.addEditorElement(
                this.editorService.getEditorElement(docItem.name),
                docItem
            );
        });
        this.insertIndex = 0;
    }

    public onDragActivate()
    {
        this.isDragActive = true;
        this.changeDetector.detectChanges();
    }

    public onDragEnter(event:DropEvent)
    {
        this.isDragOver = true;
        this.changeDetector.detectChanges();
    }

    public onDragMove(event:DropEvent)
    {
        /*
        let prevSibling = this.childComponents
                              .reduce((value:ComponentRef<any>, current:ComponentRef<any>) =>
                              {

                                  let isBeforeCursor:boolean = this.isBeforePosition(
                                      <HTMLElement>current.location.nativeElement,
                                      event.dragEvent.clientX,
                                      event.dragEvent.clientY
                                  );
                                  let isBeforeCurrent:boolean = !value || this.isBeforePosition(
                                          <HTMLElement>current.location.nativeElement,
                                          value.location.nativeElement.getBoundingClientRect().right,
                                          value.location.nativeElement.getBoundingClientRect().bottom
                                      );



                                  if ( value )
                                  {
                                      console.log( "value", value.instance.componentRef.instance );
                                  }
                                  else
                                  {
                                      console.log( null )
                                  }
                                  if ( current )
                                  {
                                      console.log( "current", current.instance.componentRef.instance, isBeforeCurrent  );
                                  }
                                  else
                                  {
                                      console.log( null )
                                  }

                                  if(isBeforeCursor && isBeforeCurrent)
                                  {
                                      return current;
                                  }

                                  return value;
                              }, null);
                              */
        let hoveredChild = this.childComponents.find( (child: ComponentRef<any>) => {
            let rect: ClientRect = child.location.nativeElement.getBoundingClientRect();
            let x: number = event.dragEvent.clientX;
            let y: number = event.dragEvent.clientY;
            return x >= rect.left && x <= rect.right && y >= rect.left && y <= rect.top;
        });

        if ( !hoveredChild )
        {
            let firstElement = this.childComponents.reduce( (first: ComponentRef<any>, current: ComponentRef<any>) => {
                if ( !first )
                {
                    return current;
                }

                let firstRect: ClientRect = first.location.nativeElement.getBoundingClientRect();
                let isBefore = this.isBeforePosition(
                    <HTMLElement>current.location.nativeElement,
                    firstRect.left,
                    firstRect.top
                );

                if ( isBefore )
                {
                    return current;
                }

                return first;
            }, null);

            if ( firstElement )
            {
                //let firstElementRect: ClientRect = firstElement.location.nativeElement.getBoundingClientRect();
                //let isBeforeFirst = this.isBeforePosition(
                //    <HTMLElement>
                //)
            }
        }

        let prevSibling = this.childComponents
                              //.filter( (child: ComponentRef<any>) => {
                              //    return this.isBeforePosition(
                              //        <HTMLElement>child.location.nativeElement,
                              //        event.dragEvent.clientX,
                              //        event.dragEvent.clientY
                              //    );
                              //})
                              .reduce((value:ComponentRef<any>, current:ComponentRef<any>) => {

                                    let isBeforeCursor:boolean = this.isBeforePosition(
                                        <HTMLElement>current.location.nativeElement,
                                        event.dragEvent.clientX,
                                        event.dragEvent.clientY
                                    );

                                    if ( !isBeforeCursor )
                                    {
                                        // current element is behind cursor position => skip element;
                                        return value;
                                    }

                                    let rect: ClientRect = (<HTMLElement>current.location.nativeElement).getBoundingClientRect();
                                    let isBefore = !value || this.isBeforePosition(
                                        <HTMLElement>value.location.nativeElement,
                                        rect.left,
                                        rect.top
                                    );

                                    if ( isBefore )
                                    {
                                        return current;
                                    }

                                    return value;
                              }, null);

        if ( prevSibling )
        {
            console.log( "sibling", prevSibling.instance.componentRef.instance );
        }

        let insertIndex:number = this.childComponents.indexOf(prevSibling) + 1;

        if(insertIndex > 0)
        {
            if(insertIndex != this.insertIndex)
            {
                this.insertIndex = insertIndex;
                if(this.shadowComponent)
                {
                    this.dropTarget.move(this.shadowComponent.hostView, this.insertIndex);
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
            if(!this.shadowComponent)
            {
                this.editorService.currentElementContainer = null;
                this.shadowComponent = this.createComponent(event.dropData.element.component);
                this.shadowComponent.location.nativeElement.classList.add('shadow-clone');
                this.changeDetector.detectChanges();
            }
        }
    }

    private isBeforePosition(element:HTMLElement, x:number, y:number):boolean
    {
        let rect:ClientRect = element.getBoundingClientRect();
        let elementGradient = ( rect.left - rect.right ) / ( rect.bottom - rect.top );
        let positionGradient = ( rect.left - x ) / ( rect.bottom - y );
        return rect.bottom <= y && rect.right >= x && positionGradient > elementGradient;
    }

    public onDragLeave()
    {
        if(this.shadowComponent)
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

    public onDrop(event:DropEvent)
    {
        this.addEditorElement(event.dropData.element);

        // trigger "dragLeave" manually because it's not triggered by interact
        this.onDragLeave();
    }

    public acceptDrop(args:any)
    {
        if(!args.dragData || !args.dragData.element)
        {
            return false;
        }

        if(!this.allowedElements)
        {
            return true;
        }

        return this.editorService.matchesElementQuery(this.allowedElements, args.dragData.element);
    }

    private createComponent<T>(component:Type<any>, position:number = 0):ComponentRef<T>
    {
        return this.dropTarget.createComponent(
            this.componentFactory.resolveComponentFactory(component),
            position
        );
    }

    private addEditorElement(element:DndEditorElement, documentItem?:DndEditorDocumentItem):ComponentRef<ElementContainerComponent>
    {
        let container:ComponentRef<ElementContainerComponent> = this.dropTarget.createComponent(
            this.componentFactory.resolveComponentFactory(ElementContainerComponent),
            this.insertIndex
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