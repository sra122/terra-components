import { DndEditorService } from '../dnd-editor.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

type ContentPart = { type:"text" | "placeholder", content:string, output:string };

export type EditableElementOptions = {
    delimiter:[string, string]
};

/**
 * Helper to make HTML-Element editable (by using contenteditable attribute) and handling drop of placeholders.
 */
export class EditableElement
{
    // Emits changes to element's content
    public contentChange: Subject<string> = new Subject<string>();

    // configuration of the element
    private options:EditableElementOptions;

    constructor(private container:HTMLElement,
                private editorService:DndEditorService,
                options?:EditableElementOptions)
    {
        // set contenteditable attribute
        this.container.contentEditable = "true";

        // avoid newlines
        // TODO: allow newlines but avoid generating new divs
        this.container.onkeydown = (event:KeyboardEvent) =>
        {
            if(event.which === 13)
            {
                event.preventDefault();
            }
        };

        // emit changes to content on every keyup
        this.container.onkeyup = (event:KeyboardEvent) =>
        {
            this.onContentChange();
            //this.notifyObservers();
            this.contentChange.next(this.content);
        };

        // Transform formatted text to plain text on paste
        this.container.onpaste = (event:ClipboardEvent) =>
        {
            event.preventDefault();
            document.execCommand(
                "insertHTML",
                false,
                event.clipboardData.getData("text/plain")
            );
            this.onContentChange();
            //this.notifyObservers();
            this.contentChange.next(this.content);
        };

        // TODO: check if needed? handled by keyup event listener?
        this.container.oncut = (event:ClipboardEvent) =>
        {
            this.onContentChange();
            //this.notifyObservers();
            this.contentChange.next(this.content);
        };

        this.options = {
            delimiter: options.delimiter
        };
    }

    /**
     * Get element's content by reading child nodes
     * @returns {string}
     */
    public get content():string
    {
        let content:string = "";
        let childNodes:NodeList = this.container.childNodes;
        let child:Node;
        let childElement:HTMLElement;

        for(let i = 0; i < childNodes.length; i++)
        {
            child = childNodes.item(i);
            if(child.nodeType === Node.TEXT_NODE)
            {
                content += child.textContent;
            }
            else if(child.nodeType === Node.ELEMENT_NODE)
            {
                // if child node is an HTMLElement only allow elements having a 'data-output'-attribute
                // to avoid other nested elements than placeholders
                childElement = <HTMLElement> child;
                content += childElement.getAttribute("data-output") || childElement.textContent;
            }
            else
            {
                console.log("Ignoring child node while concatenating content.", child);
            }
        }
        return content;
    }

    /**
     * Set element's content after parsing placeholders
     * @param value
     */
    public set content(value:string)
    {
        let contentHTML = this.parseText(value).map((contentPart:ContentPart, index: number, parts: Array<ContentPart>) =>
        {
            if(contentPart.type === "text")
            {
                return contentPart.content;
            }
            else
            {
                // append whitesapce if content ends with placeholder to fix cursor position problems
                let suffix: string = "";
                if ( index === parts.length - 1 )
                {
                    suffix = "&nbsp;"
                }
                return '<span contenteditable="false" data-output="' + contentPart.output + '">' + contentPart.content + "</span>" + suffix;
            }

        }).join("");

        this.container.innerHTML = contentHTML;
    }

    /**
     * Insert a placeholder at a defined position (x, y)
     * @param placeholderKey    string  A key of the placeholder-map in the editor configuration
     * @param positionX         number  x-coordinate where to place the placeholder at
     * @param positionY         number  y-coordinate where to place the placeholder at
     */
    public insertPlaceholderAt(placeholderKey:string, positionX:number, positionY:number)
    {
        // get selected range by position
        let range:Range = document.caretRangeFromPoint(positionX, positionY);

        // get direct child node of container element in range
        let targetContainer:Node = range.startContainer;
        while(targetContainer && targetContainer.parentElement !== this.container)
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
        placeholderNode.innerText = this.editorService.getPlaceholderName(placeholderKey);

        if(!targetContainer || targetContainer.nodeType === Node.TEXT_NODE)
        {
            // target is root container or a text node => insert at cursor position
            range.insertNode(placeholderNode);
        }
        else if(targetContainer.nodeType === Node.ELEMENT_NODE)
        {
            // target is a placeholder element => insert after element
            let sibling:Node = targetContainer.nextSibling;
            this.container.insertBefore(placeholderNode, sibling);
        }

        //this.notifyObservers();
        this.contentChange.next(this.content);
    }

    /**
     * Parse placeholders in text
     * @param input     string  The text to parse
     * @returns {ContentPart[]}
     */
    private parseText(input:string = ""):ContentPart[]
    {
        let contentParts:ContentPart[] = [];
        let placeholderName:string;
        let start:number;
        let end:number;

        while(input.length > 0)
        {
            start = input.indexOf(this.options.delimiter[0]);
            if(start > 0)
            {
                // input starts with plain text followed by placeholder
                contentParts.push({
                    type:    "text",
                    content: input.substr(0, start),
                    output:  input.substr(0, start)
                });

                // continue parsing the placeholder
                input = input.substr(start);
            }
            else if(start < 0)
            {
                // input contains no placeholders
                contentParts.push({
                    type:    "text",
                    content: input,
                    output:  input
                });

                // end parsing
                input = "";
            }
            else
            {
                // input starts with a placeholder
                // => get end of placeholder in input string
                end = input.indexOf(this.options.delimiter[1]);
                if(end > 0)
                {
                    placeholderName = input.substr(
                        this.options.delimiter[0].length,
                        end - this.options.delimiter[1].length
                    ).trim();

                    contentParts.push({
                        type:    "placeholder",
                        content: this.editorService.getPlaceholderName(placeholderName),
                        output:  this.options.delimiter[0] + " " + placeholderName + " " + this.options.delimiter[1]
                    });

                    // continue parsing input after placeholder
                    input = input.substr(end + this.options.delimiter[1].length);
                }
                else
                {
                    // placeholder is not closed => handle as plain text
                    contentParts.push({
                        type:    "text",
                        content: input,
                        output:  input
                    });
                    // end parsing
                    input = "";
                }
            }
        }

        return contentParts;
    }

    /**
     * Handle changes on content. Check if placeholders are typed manually by user.
     */
    private onContentChange()
    {
        // check for manually typed placeholders
        let children:NodeList = this.container.childNodes;
        let child:Node;
        for(let i = 0; i < children.length; i++)
        {
            child = children.item(i);

            if(child.nodeType === Node.TEXT_NODE && this.containsPlaceholder(child))
            {
                // placeholder was typed manually: Parse content and convert placeholders
                this.content = this.content;

                // move cursor to the new placeholder
                let caretOffset = i + this.parseText(child.textContent).length;
                if(caretOffset >= this.container.childNodes.length)
                {
                    caretOffset = this.container.childNodes.length - 1;
                }
                let selection:Selection = window.getSelection();
                let range:Range = document.createRange();
                range.setStart(this.container.childNodes.item(caretOffset), 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            // replace HTMLElements not having a data-output attribute
            if(child.nodeType === Node.ELEMENT_NODE && !(<HTMLElement>child).getAttribute("data-output"))
            {
                this.container.replaceChild(
                    document.createTextNode(child.textContent),
                    child
                );
            }
        }

    }

    /**
     * Check if a node contains unconverted placeholder string
     * @param node
     * @returns {boolean}
     */
    private containsPlaceholder(node:Node):boolean
    {
        let start:number = node.textContent.indexOf(this.options.delimiter[0]);
        let end:number = node.textContent.indexOf(this.options.delimiter[1]);

        if(start < 0 || end < 0)
        {
            return false;
        }

        return this.editorService.isPlaceholder(
            node.textContent.substring(start + this.options.delimiter[0].length, end).trim()
        )
    }

}