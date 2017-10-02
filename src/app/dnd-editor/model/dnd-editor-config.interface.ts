import { Ruler } from '../helper/ruler.helper';
import { EditorComponentGroup } from './dnd-editor-component-group.interface';

export type PlaceholderMap = { [key:string]:string | PlaceholderMap };

export interface DndEditorConfig
{
    width?:Ruler,
    height?:Ruler,
    componentGroups:EditorComponentGroup[],
    placeholder?:PlaceholderMap
}