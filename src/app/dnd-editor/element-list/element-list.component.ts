import { Component, Input, OnInit } from "@angular/core";
import { DndEditorElementGroup } from "../model/dnd-editor-element-group.interface";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'dnd-editor-element-list',
    template: require('./element-list.component.html'),
    styles: [require('./element-list.component.scss')],
    animations: [
        trigger('groupState', [
            state('collapsed', style({
                height: 0,
                'padding-top': 0,
                'padding-bottom': 0
            })),
            state('expanded', style({
                height: '*'
            })),
            transition('collapsed <=> expanded', [
                animate(100)
            ])
        ])
    ]
})
export class ElementListComponent implements OnInit
{
    @Input()
    public elementGroups: DndEditorElementGroup[] = [];

    private draggedElement: HTMLElement;
    private draggedElementPos: {x: number, y: number};

    private groupStates: string[];

    public ngOnInit(): void
    {
        this.groupStates = this.elementGroups.map( (group: DndEditorElementGroup) => 'collapsed' );
    }

    public toggleGroupState( index: number )
    {
        if ( this.groupStates[index] === 'collapsed' )
        {
            this.groupStates[index] = 'expanded';
        }
        else
        {
            this.groupStates[index] = 'collapsed'
        }
    }

    public startDrag( event: Interact.InteractEvent )
    {
        if ( this.draggedElement )
        {
            console.error("Drag already in progress.");
        }

        this.draggedElement = event.target.cloneNode(true);
        document.body.appendChild( this.draggedElement );

        let clientRect: ClientRect = event.target.getBoundingClientRect();
        this.draggedElement.style.width = clientRect.width + 'px';
        this.draggedElement.style.height = clientRect.height + 'px';
        this.draggedElement.classList.add("draggable-clone");


        this.draggedElementPos = {
            x: clientRect.left,
            y: clientRect.top
        };
    }

    public handleMove( event: Interact.InteractEvent )
    {
        if ( this.draggedElement )
        {
            this.draggedElementPos.x += event.dx;
            this.draggedElementPos.y += event.dy;
            this.draggedElement.style.left = this.draggedElementPos.x + 'px';
            this.draggedElement.style.top = this.draggedElementPos.y + 'px';
        }
    }

    public stopDrag( event: Interact.InteractEvent )
    {
        if ( this.draggedElement )
        {
            this.draggedElement.remove();
            this.draggedElement = null;
        }
    }
}