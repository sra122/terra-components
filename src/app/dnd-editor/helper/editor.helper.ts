import { DndEditorConfig } from "../model/dnd-editor-config.interface";
import { DndEditorElement } from "../model/dnd-editor-element.interface";
import { DndEditorElementGroup } from "../model/dnd-editor-element-group.interface";
export class EditorHelper
{
    constructor( private config: DndEditorConfig )
    {
    }

    public matchesQuery( query: string, element: DndEditorElement ): boolean
    {
        let group: DndEditorElementGroup = this.getElementGroup( element );
        if ( !group )
        {
            return false;
        }

        let groupId: string = this.getGroupId( group );
        let elementId: string = this.getElementId( element );

        return query.split(",")
                    .map( q => q.trim() )
                    .some( q => {
                        return this.matchesQueryString( q, groupId, elementId );
                    });
    }

    private matchesQueryString( query: string, groupId: string, elementId: string ): boolean
    {
        let queryExp = /^([!]?)(\w+)\.([\w\*]+)$/;
        if ( queryExp.test( query ) )
        {
            let match = queryExp.exec( query );
            let result = groupId === match[2] && (elementId === match[3] || match[3] === "*");

            if ( match[1] === "!" )
            {
                return !result;
            }

            return result;
        }

        console.log( "Cannot parse query: " + query );
        return false;
    }

    private getElementGroup( element: DndEditorElement ): DndEditorElementGroup
    {
        let group = this.config.elementGroups.find( (group: DndEditorElementGroup) => {
            return group.elements.some( (e: DndEditorElement) => {
                return this.getElementId( element ) === this.getElementId( e );
            });
        });

        if ( !group )
        {
            console.error( "Cannot find related ElementGroup for element: " + this.getElementId( element ) );
            return null;
        }

        return group;
    }

    private getElementId( element: DndEditorElement ): string
    {
        if ( !element.id )
        {
            let annotations: { [key: string]: any } = Reflect.getMetadata( "annotations", element.component ) || {};
            element.id = annotations[0].selector;
        }

        return element.id;
    }

    private getGroupId( group: DndEditorElementGroup ): string
    {
        if ( !group.id )
        {
            group.id = group.name.toLowerCase().replace(/\s+/g, '_');
        }

        return group.id;
    }
}