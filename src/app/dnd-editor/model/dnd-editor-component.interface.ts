import { Type } from '@angular/core';

/**
 * A single entry of ElementComponentGroup.components
 * Represents an available component for the editor.
 */
export interface EditorComponent
{
    // An optional identifier. Can be used to restrict allowed elements in ElementDropzones
    id?:string;

    // The displayed name of the component
    name:string;

    // The angular component to be rendered in preview document
    component:Type<any>;

    // An optional CSS class to change the icon in the ComponentList
    iconClass?:string;

    // Define scope for placeholders to be available in this component
    scope?:string;
}