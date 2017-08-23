import {
    ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output,
    SimpleChanges, ViewChild
} from "@angular/core";
import { DropEvent } from "../../ng2-interact/dropEvent.interface";
import { DndEditorService } from "../dnd-editor.service";

export type PlaceholderContent = { type: "text" | "placeholder", content: string, output: string };

@Component({
    selector: 'dnd-editor-placeholder-dropzone',
    template: require('./placeholder-dropzone.component.html'),
    styles: [require('./placeholder-dropzone.component.scss')]
})
export class PlaceholderDropzoneComponent implements OnChanges
{
    @Input()
    public content: string;

    @Input()
    public delimiter: [string, string] = ["{{", "}}"];

    @Output()
    public contentChange: EventEmitter<string> = new EventEmitter<string>();

    public parsedContent: PlaceholderContent[] = [];

    public selectedIndex: number = -1;

    @ViewChild('container', { read: ElementRef })
    private containerElement: ElementRef;

    constructor(
        private editorService: DndEditorService,
        private changeDetector: ChangeDetectorRef
    )
    {

    }

    public ngOnChanges( changes: SimpleChanges ): void
    {
        if( changes.hasOwnProperty( "content" ) && changes["content"].previousValue !== changes["content"].currentValue )
        {
            this.parseContent()
        }
    }

    private parseContent()
    {
        this.parsedContent = [];
        let content: string = this.content;
        let start: number, end: number;

        while( content.length > 0 )
        {
            start = content.indexOf( this.delimiter[0] );
            if ( start > 0 )
            {
                this.parsedContent.push({
                    content: content.substr(0, start),
                    output: content.substr(0, start),
                    type: "text"
                });
                content = content.substr( start );
            }
            else if ( start < 0) {
                this.parsedContent.push({
                    content: content,
                    output: content,
                    type: "text"
                });
                content = "";
            }
            else
            {
                end = content.indexOf( this.delimiter[1] );
                this.parsedContent.push({
                    content: this.editorService.getPlaceholderName(
                        content.substr(this.delimiter[0].length, end - this.delimiter[1].length).trim()
                    ),
                    output: this.delimiter[0] + content.substr(this.delimiter[0].length, end - this.delimiter[1].length).trim() + this.delimiter[1],
                    type: "placeholder"
                });
                content = content.substr( end + this.delimiter[1].length );
            }
        }
    }

    // private updateContent()
    // {
    //     let content: string = "";
    //     let childList: HTMLCollection = (<HTMLElement>this.containerElement.nativeElement).children;
    //     for ( let i = 0; i < childList.length; i++ )
    //     {
    //         content += childList.item(i).getAttribute("data-output");
    //     }
    //     this.contentChange.emit( content );
    // }

    public acceptDrop( args: any )
    {
        return args.dragData && args.dragData.placeholder;
    }

    public dropPlaceholder( event: DropEvent )
    {
        let placeholderKey: string = event.dropData.placeholder;

        if ( !placeholderKey || placeholderKey.length <= 0 )
        {
            console.error( "Cannot read placeholder from drop target");
            return;
        }
        // set timeout to ensure that .placeholder-caret has been removed
        setTimeout( () => {
            let range: Range = document.caretRangeFromPoint( event.dragEvent.clientX, event.dragEvent.clientY );
            let parent: HTMLElement = range.startContainer.parentElement;
            let container: HTMLElement = <HTMLElement>event.target;
            let idx = -1;
            for( let i = 0; i < container.children.length; i++ )
            {
                if ( container.children.item(i).contains( parent ) )
                {
                    idx = i;
                    break;
                }
            }

            if ( parent.classList.contains("placeholder") )
            {
                if ( range.startOffset > range.startContainer.textContent.length / 2 )
                {
                    idx++;
                }
                this.parsedContent.splice( idx, 0, {
                    content: this.editorService.getPlaceholderName( placeholderKey ),
                    output: this.delimiter[0] + placeholderKey + this.delimiter[1],
                    type: "placeholder"
                });
            }
            else
            {
                let content:string = this.parsedContent[idx].content;
                this.parsedContent.splice(
                    idx,
                    1,
                    {
                        content: content.substr(0, range.startOffset ),
                        output: content.substr(0, range.startOffset ),
                        type: "text"
                    },
                    {
                        content: this.editorService.getPlaceholderName( placeholderKey ),
                        output: this.delimiter[0] + placeholderKey + this.delimiter[1],
                        type: "placeholder"
                    },
                    {
                        content: content.substr( range.startOffset ),
                        output: content.substr( range.startOffset ),
                        type: "text"
                    }
                );
            }

            this.changeDetector.detectChanges();
            this.updateParsedContent();
        });
    }

    public onCursorChanged( event: Event )
    {
        setTimeout(() =>
        {
            // let parent: HTMLElement = <HTMLElement>event.target;
            let parent: HTMLElement = this.containerElement.nativeElement;
            let element: Element = window.getSelection().anchorNode.parentElement;
            this.selectedIndex = -1;
            for ( let i = 0; i < parent.children.length; i++ )
            {
                if ( parent.children.item(i).contains( element ) && i !== this.selectedIndex )
                {
                    this.selectedIndex = i;
                    this.changeDetector.detectChanges();
                    break;
                }
            }

        });

        // this.updateParsedContent();
    }

    public onBlur()
    {
        this.selectedIndex = -1;
        this.updateParsedContent();
    }

    public updateParsedContent()
    {
        let childList: HTMLCollection = this.containerElement.nativeElement.children;
        let parsedContent: PlaceholderContent[] = [];
        let content: string = "";
        for ( let i = 0; i < childList.length; i++ )
        {
            if ( childList.item(i).textContent.trim().length <= 0 )
            {
                continue;
            }

            let output: string = childList.item(i).getAttribute("data-output");
            if ( output.startsWith(this.delimiter[0]) && output.endsWith(this.delimiter[1]) )
            {
                parsedContent.push({
                    type: "placeholder",
                    content: this.editorService.getPlaceholderName(
                        output.substring( this.delimiter[0].length, output.length - this.delimiter[1].length )
                    ),
                    output: output
                });
            }
            else
            {
                output = (<HTMLElement>childList.item(i)).innerText;
                parsedContent.push({
                    type: "text",
                    content: output,
                    output: output
                });
            }
            content += output;
        }

        if ( content != this.content )
        {
            this.parsedContent = parsedContent;
            this.content = content;
            this.contentChange.emit( content );
            this.changeDetector.detectChanges();
        }
    }

    // public updateTextContent( event: Event, index: number )
    // {
    //     if ( !this.parsedContent[index] )
    //     {
    //         this.parsedContent[index] = {
    //             type: "text",
    //             content: "",
    //             output: ""
    //         };
    //     }
    //     if ( this.parsedContent[index].type === "text" )
    //     {
    //         this.parsedContent[index].content = (<HTMLElement>event.target).textContent;
    //         this.updateContent();
    //     }
    //     else
    //     {
    //         console.error("Element " + index + " is a placeholder and cannot be edited.");
    //     }
    // }
    //
    // public removePlaceholder( index: number )
    // {
    //     if ( this.parsedContent[index] && this.parsedContent[index].type === "placeholder" )
    //     {
    //         this.parsedContent.splice( index, 1 );
    //         this.updateContent();
    //     }
    //     else
    //     {
    //         console.error( "Cannot delete placeholder at position " + index );
    //     }
    // }

    public trackByFn( index: number, item: any )
    {
        return index;
    }
}