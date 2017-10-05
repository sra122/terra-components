import {
    AfterViewInit,
    Component,
    Input,
    QueryList,
    ViewChildren
} from '@angular/core';
import { EditorComponentGroup } from '../model/dnd-editor-component-group.interface';
import { TerraDraggableDirective } from '../../interactables/draggable.directive';
import { DraggableFactory } from '../../interactables/draggable.factory';

/**
 * Prints a list of available editor components grouped in terra-portlets
 */
@Component({
    selector:   'dnd-editor-component-list',
    template:   require('./component-list.component.html'),
    styles:     [require('./component-list.component.scss')]
})
export class EditorComponentListComponent implements AfterViewInit
{
    @Input()
    public componentGroups:EditorComponentGroup[] = [];

    @ViewChildren( TerraDraggableDirective )
    private draggables: QueryList<TerraDraggableDirective>;

    public ngAfterViewInit():void
    {
        // initialize default drag behavior for each editor component
        this.draggables.forEach(
            ( draggable: TerraDraggableDirective ) => {
                new DraggableFactory( draggable );
            }
        )
    }
}