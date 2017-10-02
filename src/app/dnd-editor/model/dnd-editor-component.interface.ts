import { Type } from '@angular/core';

export interface EditorComponent
{
    id?:string;
    name:string;
    component:Type<any>;
    iconClass?:string;
    scope?:string;
}