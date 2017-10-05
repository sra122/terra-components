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
    // the text-content of this dropzone. Placeholders are resoled by using the defined delimiters
    @Input()
    public content:string;

    // delimiters to resolve/ parse placeholders in content
    @Input()
    public delimiter:[string, string] = ["{{", "}}"];

    // emits changes to text content
    @Output()
    public contentChange:EventEmitter<string> = new EventEmitter<string>();

    // references the element to make editable
    @ViewChild('container', {read: ElementRef})
    private containerElement:ElementRef;

    // the editable element
    private editableElement:EditableElement;

    constructor(private editorService:DndEditorService)
    {

    }

    public ngOnInit():void
    {
        // apply helper class to make containerElement editable
        this.editableElement = new EditableElement(
            this.containerElement.nativeElement,
            this.editorService,
            {
                delimiter: this.delimiter
            }
        );

        // assign content to be parsed.
        this.editableElement.content = this.content;

        // subscribe to changes on text-content pass to parent component
        this.editableElement.contentChange.subscribe(content =>
        {
            this.content = content;
            this.contentChange.emit(content);
        });
    }

    /**
     * Only allow dropping placeholders
     * @param args
     * @returns {any}
     */
    public acceptDrop(args:any)
    {
        return args.dragData && args.dragData.placeholder;
    }

    /**
     * Handle drop of placeholders
     * @param event
     */
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