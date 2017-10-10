import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { EditorItem } from '../model/dnd-editor-item.model';
import { DndEditorService } from '../dnd-editor.service';
import { Subscription } from 'rxjs/Subscription';
import { ElementDropzoneComponent } from '../element-dropzone/element-dropzone.component';

@Component({
    selector: 'dnd-editor-section-container',
    template: require('./section-container.component.html'),
    styles: [require('./section-container.component.scss')]
})
export class SectionContainerComponent implements OnInit, OnDestroy
{
    @ViewChild('container', {read: ViewContainerRef })
    public container: ViewContainerRef;

    private dropzoneComponents: Array<ComponentRef<ElementDropzoneComponent>> = [];

    private _editorItem: EditorItem;

    public get editorItem(): EditorItem
    {
        return this._editorItem;
    }

    public set editorItem( item: EditorItem )
    {
        this._editorItem = item;
        this.container.clear();
        this.dropzoneComponents = [];

        item.children.idList.forEach(
            (dropzoneId: string) => {

                let dropzoneComponent: ComponentRef<ElementDropzoneComponent> = this.container.createComponent(
                    this.componentFactoryResolver.resolveComponentFactory(
                        ElementDropzoneComponent
                    )
                );

                dropzoneComponent.instance.dropzoneId = dropzoneId;
                dropzoneComponent.instance.initDropzone( item.children.get( dropzoneId ) );
                this.dropzoneComponents.push( dropzoneComponent );
            }
        )
    }

    public selected: boolean = false;
    private selectedSectionSubscription: Subscription;

    constructor(
        private editorService: DndEditorService,
        private changeDetector: ChangeDetectorRef,
        private componentFactoryResolver: ComponentFactoryResolver
    )
    {
    }

    public ngOnInit():void
    {
        this.selectedSectionSubscription = this.editorService
                                               .selectedSectionChange
                                               .subscribe( (container: SectionContainerComponent) => {
                                                   this.selected = container === this;
                                                   this.changeDetector.detectChanges();
                                               });
    }

    public ngOnDestroy():void
    {
        if ( this.selectedSectionSubscription )
        {
            this.selectedSectionSubscription.unsubscribe();
        }
    }

    public selectSection()
    {
        this.editorService.selectSection( this );
    }
}
