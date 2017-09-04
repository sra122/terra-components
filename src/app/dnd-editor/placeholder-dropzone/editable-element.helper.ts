import { DndEditorService } from "../dnd-editor.service";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { Key } from "readline";

type ContentPart = { type: "text" | "placeholder", content: string, output: string };

export type EditableElementOptions = {
    delimiter: [string, string]
};

export class EditableElement
{
    public contentChange: Observable<string>;
    private contentListeners: Array<Observer<string>> = [];
    private options: EditableElementOptions;

    constructor(
        private container: HTMLElement,
        private editorService: DndEditorService,
        options?: EditableElementOptions )
    {
        this.contentChange = new Observable( (observer: Observer<string>) => {
            observer.next( this.content );
            this.contentListeners.push( observer );

            return () => {
                let idx: number = this.contentListeners.indexOf( observer );
                this.contentListeners.splice( idx, 1 );
            };
        });

        this.container.contentEditable = "true";

        this.container.onkeydown = (event: KeyboardEvent) => {
            if ( event.which === 13 )
            {
                event.preventDefault();
            }
        };

        this.container.onkeyup = (event: KeyboardEvent) => {
            this.onContentChange();
            this.notifyObservers();
        };

        this.container.onpaste = (event: ClipboardEvent) => {
            event.preventDefault();
            document.execCommand(
                "insertHTML",
                false,
                event.clipboardData.getData("text/plain")
            );
            this.onContentChange();
            this.notifyObservers();
        };

        this.container.oncut = (event: ClipboardEvent) => {
            this.onContentChange();
            this.notifyObservers();
        };

        this.options = {
            delimiter:      options.delimiter
        };
    }

    public get content(): string
    {
        let content: string = "";
        let childNodes: NodeList = this.container.childNodes;
        let child: Node;
        let childElement: HTMLElement;

        for ( let i = 0; i < childNodes.length; i++ )
        {
            child = childNodes.item(i);
            if ( child.nodeType === Node.TEXT_NODE )
            {
                content += child.textContent;
            }
            else if ( child.nodeType === Node.ELEMENT_NODE )
            {
                childElement = <HTMLElement> child;
                content += childElement.getAttribute("data-output") || childElement.textContent;
            }
            else
            {
                console.log( "Ignoring child node while concatenating content.", child );
            }
        }
        return content;
    }

    public set content( value: string )
    {
        // let caretOffset: number = -1;
        // let caretAnchor: Node = null;
        // let selection: Selection = window.getSelection();
        //
        // if ( this.container.contains( selection.anchorNode ) )
        // {
        //     caretAnchor = selection.anchorNode;
        //     caretOffset = selection.anchorOffset;
        // }

        let contentHTML = this.parseText( value ).map( (contentPart: ContentPart) => {

            if ( contentPart.type === "text" )
            {
                return contentPart.content;
            }
            else
            {
                return '<span contenteditable="false" data-output="' + contentPart.output + '">' + contentPart.content + "</span>";
            }

        }).join("");

        // window.getSelection().getRangeAt(0).setStart( this.container, 1 );

        this.container.innerHTML = contentHTML;
    }

    public insertPlaceholderAt( placeholderKey: string, positionX: number, positionY: number )
    {
        // get selected range by position
        let range: Range = document.caretRangeFromPoint( positionX, positionY );

        // get direct child node of container element in range
        let targetContainer: Node = range.startContainer;
        while( targetContainer && targetContainer.parentElement !== this.container )
        {
            targetContainer = targetContainer.parentElement;
        }

        // construct element to insert in container
        let placeholderNode = document.createElement("SPAN");
        placeholderNode.contentEditable = "false";
        placeholderNode.setAttribute(
            "data-output",
            this.options.delimiter[0] + " " + placeholderKey + " " + this.options.delimiter[1]
        );
        placeholderNode.innerText = this.editorService.getPlaceholderName( placeholderKey );

        if ( !targetContainer || targetContainer.nodeType === Node.TEXT_NODE )
        {
            // target is root container or a text node => insert at cursor position
            range.insertNode( placeholderNode );
        }
        else if ( targetContainer.nodeType === Node.ELEMENT_NODE )
        {
            // target is a placeholder element => insert after element
            let sibling: Node = targetContainer.nextSibling;
            this.container.insertBefore( placeholderNode, sibling );
        }

        this.notifyObservers();
    }

    private parseText( input: string ): ContentPart[]
    {
        let contentParts: ContentPart[] = [];
        let placeholderName: string;
        let start: number;
        let end: number;

        while( input.length > 0 )
        {
            start = input.indexOf( this.options.delimiter[0] );
            if ( start > 0 )
            {
                contentParts.push({
                    type: "text",
                    content: input.substr(0, start),
                    output: input.substr(0, start)
                });
                input = input.substr( start );
            }
            else if ( start < 0 )
            {
                contentParts.push({
                    type: "text",
                    content: input,
                    output: input
                });
                input = "";
            }
            else
            {
                end = input.indexOf( this.options.delimiter[1] );
                if ( end > 0 )
                {
                    placeholderName = input.substr(
                        this.options.delimiter[0].length,
                        end - this.options.delimiter[1].length
                    ).trim();

                    contentParts.push({
                        type: "placeholder",
                        content: this.editorService.getPlaceholderName( placeholderName ),
                        output: this.options.delimiter[0] + " " + placeholderName + " " + this.options.delimiter[1]
                    });
                    input = input.substr( end + this.options.delimiter[1].length );
                }
                else
                {
                    contentParts.push({
                        type: "text",
                        content: input,
                        output: input
                    });
                    input = "";
                }
            }
        }

        return contentParts;
    }

    private onContentChange()
    {
        // check for manually typed placeholders
        let children: NodeList = this.container.childNodes;
        let child: Node;
        for ( let i = 0; i < children.length; i++ )
        {
            child = children.item( i );

            if ( child.nodeType === Node.TEXT_NODE && this.containsPlaceholder( child ) )
            {
                this.content = this.content;

                let caretOffset = i + this.parseText( child.textContent ).length;
                if ( caretOffset >= this.container.childNodes.length )
                {
                    caretOffset = this.container.childNodes.length - 1;
                }
                let selection: Selection = window.getSelection();
                let range: Range = document.createRange();
                range.setStart( this.container.childNodes.item( caretOffset ), 0);
                range.collapse( true );
                selection.removeAllRanges();
                selection.addRange( range );
            }

            // replace HTMLElements
            if ( child.nodeType === Node.ELEMENT_NODE && !(<HTMLElement>child).getAttribute("data-output") )
            {
                this.container.replaceChild(
                    document.createTextNode( child.textContent ),
                    child
                );
            }
        }

    }

    private containsPlaceholder( node: Node ): boolean
    {
        let start: number = node.textContent.indexOf( this.options.delimiter[0] );
        let end: number   = node.textContent.indexOf( this.options.delimiter[1] );

        if ( start < 0 || end < 0 )
        {
            return false;
        }

        return this.editorService.isPlaceholder(
            node.textContent.substring( start + this.options.delimiter[0].length, end ).trim()
        )
    }

    private notifyObservers()
    {
        let content: string = this.content;
        this.contentListeners.forEach( (listener: Observer<string>) => {
            listener.next( content );
        });
    }

}