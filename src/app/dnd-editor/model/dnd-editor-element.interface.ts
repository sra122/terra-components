import { Type } from "@angular/core";

export interface DndEditorElement
{
    id?: string;
    name: string;
    component: Type<any>;
    iconClass?: string;
}