import { EventEmitter } from '@angular/core';
import { EditorPropertyInterface } from '../../../model/dnd-editor-property.decorator';

export interface PropertyInputComponent<T>
{
    property:EditorPropertyInterface;
    value:T;
    valueChange:EventEmitter<T>;
}