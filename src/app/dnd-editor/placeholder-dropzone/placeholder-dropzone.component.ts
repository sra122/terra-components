import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { DndEditorService } from '../dnd-editor.service';
import { EditableElement } from './editable-element.helper';
import { DropEvent } from '../../interactables/dropEvent.interface';

export type PlaceholderContent = { type:"text" | "placeholder", content:string, output:string };

@Component({
    selector: 'dnd-editor-placeholder-dropzone',
    template: require('./placeholder-dropzone.component.html'),
    styles:   [require('./placeholder-dropzone.component.scss')]
})
export class PlaceholderDropzoneComponent implements OnInit
{

    @Input()
    public content:string;

    @Input()
    public delimiter:[string, string] = ["{{",
                                         "}}"];

    @Output()
    public contentChange:EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('container', {read: ElementRef})
    private containerElement:ElementRef;

    private editableElement:EditableElement;

    constructor(private editorService:DndEditorService)
    {

    }

    public ngOnInit():void
    {
        this.editableElement = new EditableElement(
            this.containerElement.nativeElement,
            this.editorService,
            {
                delimiter: this.delimiter
            }
        );

        this.editableElement.content = this.content;

        this.editableElement.contentChange.subscribe(content =>
        {
            this.content = content;
            this.contentChange.emit(content);
        });
    }

    public acceptDrop(args:any)
    {
        return args.dragData && args.dragData.placeholder;
    }

    public dropPlaceholder(event:DropEvent)
    {
        let placeholderKey:string = event.dropData.placeholder;

        if(!placeholderKey || placeholderKey.length <= 0)
        {
            console.error("Cannot read placeholder from drop target");
            return;
        }

        // set timeout to ensure that .placeholder-caret has been removed
        setTimeout(() =>
        {
            this.editableElement.insertPlaceholderAt(
                placeholderKey,
                event.dragEvent.clientX,
                event.dragEvent.clientY
            );
        });
    }
}