import { DndEditorConfig } from '../model/dnd-editor-config.interface';
import { EditorComponent } from '../model/dnd-editor-component.interface';
import { EditorComponentGroup } from '../model/dnd-editor-component-group.interface';

export class EditorHelper
{
    constructor(private config:DndEditorConfig)
    {
    }

    public matchesQuery(query:string, element:EditorComponent):boolean
    {
        let group:EditorComponentGroup = this.getElementGroup(element);
        if(!group)
        {
            return false;
        }

        let groupId:string = this.getGroupId(group);
        let elementId:string = this.getElementId(element);

        return query.split(",")
                    .map(q => q.trim())
                    .some(q =>
                    {
                        return this.matchesQueryString(q, groupId, elementId);
                    });
    }

    private matchesQueryString(query:string, groupId:string, elementId:string):boolean
    {
        let queryExp = /^([!]?)(\w+)\.([\w\*]+)$/;
        if(queryExp.test(query))
        {
            let match = queryExp.exec(query);
            let result = groupId === match[2] && (elementId === match[3] || match[3] === "*");

            if(match[1] === "!")
            {
                return !result;
            }

            return result;
        }

        console.log("Cannot parse query: " + query);
        return false;
    }

    private getElementGroup(element:EditorComponent):EditorComponentGroup
    {
        let group = this.config.componentGroups.find((group:EditorComponentGroup) =>
        {
            return group.components.some((e:EditorComponent) =>
            {
                return this.getElementId(element) === this.getElementId(e);
            });
        });

        if(!group)
        {
            console.error("Cannot find related ElementGroup for element: " + this.getElementId(element));
            return null;
        }

        return group;
    }

    private getElementId(element:EditorComponent):string
    {
        if(!element.id)
        {
            let annotations:{ [key:string]:any } = Reflect.getMetadata("annotations", element.component) || {};
            element.id = annotations[0].selector;
        }

        return element.id;
    }

    private getGroupId(group:EditorComponentGroup):string
    {
        if(!group.id)
        {
            group.id = group.name.toLowerCase().replace(/\s+/g, '_');
        }

        return group.id;
    }
}