import {
    AfterContentInit,
    AfterViewChecked,
    ChangeDetectorRef, Component, ComponentRef, ContentChildren, ElementRef, EventEmitter, HostListener, Input,
    OnInit, Output, QueryList, ViewChild
} from "@angular/core";
import { DndEditorElement } from "./model/dnd-editor-element.interface";
import { DndEditorConfig } from "./model/dnd-editor-config.interface";
import { DndEditorService } from "./dnd-editor.service";
import { ElementDropzoneComponent } from "./element-dropzone/element-dropzone.component";
import { DndEditorDocument } from "./model/dnd-editor-document.interface";


@Component({
    selector: 'terra-dnd-editor',
    template: require('./dnd-editor.component.html'),
    styles: [require('./dnd-editor.component.scss')],
    providers: [DndEditorService]
})
export class DndEditorCompontent implements OnInit, AfterContentInit
{

    @Input('dnd-editor-config')
    public config: DndEditorConfig;

    @Input('dnd-editor-document')
    public document: DndEditorDocument;

    @Output('dnd-editor-documentChange')
    public documentChange: EventEmitter<DndEditorDocument> = new EventEmitter<DndEditorDocument>();

    @ViewChild('editorContent', { read: ElementRef })
    private editorContent: ElementRef;

    @ViewChild('propertyList', { read: ElementRef })
    private propertyListElement: ElementRef;

    @ViewChild('placeholderList', { read: ElementRef })
    private placeholderListElement: ElementRef;

    @ContentChildren(ElementDropzoneComponent)
    private dropzones: QueryList<ElementDropzoneComponent>;

    private selectedComponent: ComponentRef<any>;

    private get selectedElement(): DndEditorElement
    {
        if ( this.selectedComponent )
        {
            for( let i = 0; i < this.config.elementGroups.length; i++ )
            {
                let result = this.config.elementGroups[i].elements.find(
                    ( element: DndEditorElement ) => {
                        return element.component === this.selectedComponent.componentType;
                    }
                );

                if ( result )
                {
                    return result;
                }
            }
        }

        return null;
    }

    constructor(
        private editorService: DndEditorService,
        private changeDetector: ChangeDetectorRef
    )
    {
    }

    public ngOnInit(): void
    {
        this.editorService.editorConfig = this.config;
        this.editorService.selectedComponent.subscribe( (component: ComponentRef<any>) => {
            this.selectedComponent = component;
            this.changeDetector.detectChanges();
        });
    }

    public ngAfterContentInit(): void
    {
        this.dropzones.forEach( (dropzone: ElementDropzoneComponent) => {
            dropzone.onDocumentChange.subscribe( () => {
                setTimeout( () => {
                    this.updateDocument();
                }, 100 );
            });

            let dropzoneId = dropzone.dropzoneId;
            if ( this.document && this.document[dropzoneId] )
            {
                dropzone.initDropzone( this.document[dropzoneId] );
            }
        });
    }


    @HostListener('document:click', ['$event'])
    public unselectComponent( event )
    {
        if ( document.body.contains( event.target )
            && this.selectedComponent
            && !this.selectedComponent.location.nativeElement.contains( event.target )
            && !this.propertyListElement.nativeElement.contains( event.target )
            && !this.placeholderListElement.nativeElement.contains( event.target ) )
        {
            this.editorService.selectComponent( null );
        }
    }

    public updateDocument()
    {
        let document: { [key: string]: any } = {};

        this.dropzones.forEach( (dropzone: ElementDropzoneComponent, index: number) => {
            let key: string = dropzone.dropzoneId || index + '';
            document[key] = dropzone.getDocumentItems();
        });

        this.documentChange.emit(document);
    }
}