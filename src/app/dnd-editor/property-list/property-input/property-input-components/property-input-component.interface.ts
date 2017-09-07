import { EventEmitter } from '@angular/core';
import { DndEditorElementProperty } from '../../../model/dnd-editor-element-property.decorator';

export interface PropertyInputComponent<T>
{
    property:DndEditorElementProperty;
    value:T;
    valueChange:EventEmitter<T>;
}