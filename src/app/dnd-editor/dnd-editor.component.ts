import {
    AfterContentInit,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChild
} from '@angular/core';
import { DndEditorConfig } from './model/dnd-editor-config.interface';
import { DndEditorService } from './dnd-editor.service';
import { ElementDropzoneComponent } from './element-dropzone/element-dropzone.component';
import {
    EditorDocument,
    EditorDocumentInterface
} from './model/dnd-editor-document.model';
import { ElementContainerComponent } from './element-container/element-container.component';
import { EditorItemList } from './model/dnd-editor-item-list.model';
import { Subscription } from 'rxjs/Subscription';
import { OnEditorPropertyChange } from './model/dnd-editor-property.decorator';
import { SectionContainerComponent } from './section-container/section-container.component';

@Component({
    selector:  'terra-dnd-editor',
    template:  require('./dnd-editor.component.html'),
    styles:    [require('./dnd-editor.component.scss')],
    providers: [
        DndEditorService,
        { provide: ElementContainerComponent, useValue: null },
        { provide: SectionContainerComponent, useValue: null }
    ]
})
export class DndEditorCompontent implements OnInit, AfterContentInit
{
    // The document edited by this component
    private _document: EditorDocument;

    @Input('dnd-editor-config')
    public config:DndEditorConfig;

    // set plain data of the editor document
    @Input('dnd-editor-document')
    public set document( data: EditorDocumentInterface )
    {
        this._document = EditorDocument.create( data );

        if ( this.documentSubscription )
        {
            this.documentSubscription.unsubscribe();
        }

        this.documentSubscription = this._document.onChange.subscribe(
            ( document: EditorDocument ) => {
                this.documentChange.emit( document.serialize() );
            }
        );
    }

    // get plain data of the editor document
    public get document(): EditorDocumentInterface
    {
        if ( this._document )
        {
            return this._document.serialize();
        }

        return {};
    }

    // emit changes on the document
    @Output('dnd-editor-documentChange')
    public documentChange:EventEmitter<EditorDocumentInterface> = new EventEmitter<EditorDocumentInterface>();

    @ViewChild('propertyList', {read: ElementRef})
    private propertyListElement:ElementRef;

    @ViewChild('placeholderList', {read: ElementRef})
    private placeholderListElement:ElementRef;

    // root dropzones in the editor
    @ContentChildren(ElementDropzoneComponent)
    private dropzones:QueryList<ElementDropzoneComponent>;

    private selectedComponent:ElementContainerComponent;

    private documentSubscription: Subscription;

    constructor(private editorService:DndEditorService,
                private changeDetector:ChangeDetectorRef)
    {
    }

    public ngOnInit():void
    {
        this.editorService.editorConfig = this.config;
        this.editorService.selectedComponentChange.subscribe((component:ElementContainerComponent) =>
        {
            this.selectedComponent = component;
            this.changeDetector.detectChanges();
        });

        OnEditorPropertyChange( null, () => {
            this.documentChange.emit( this.document );
        });
    }

    public ngAfterContentInit():void
    {
        this.dropzones.forEach((dropzone:ElementDropzoneComponent) =>
        {
            let dropzoneId = dropzone.dropzoneId;

            /*
            dropzone.itemListChange.subscribe( (itemList: EditorItemList) =>
            {
                this._document.blocks.set(
                    dropzoneId,
                    itemList
                );
                this.documentChange.emit( this.document );
            });
            */

            if ( this._document && this._document.blocks.has( dropzoneId ) )
            {
                dropzone.initDropzone( this._document.blocks.get( dropzoneId ) );
            }
        });
    }


    @HostListener('document:click', ['$event'])
    public unselectComponent(event)
    {
        if(document.body.contains(event.target)
           && this.selectedComponent
           && !this.selectedComponent.element.nativeElement.contains(event.target)
           && !this.propertyListElement.nativeElement.contains(event.target)
           && !this.placeholderListElement.nativeElement.contains(event.target))
        {
            this.editorService.selectComponent(null);
        }
    }

    public hasPlaceholder( component: ElementContainerComponent ): boolean
    {
        if ( !component )
        {
            return false;
        }
        return component.element.nativeElement.querySelectorAll('dnd-editor-placeholder-dropzone').length > 0
    }
}