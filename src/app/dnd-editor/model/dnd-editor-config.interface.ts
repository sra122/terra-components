import { Ruler } from "../helper/ruler.helper";
import { DndEditorElementGroup } from "./dnd-editor-element-group.interface";

export type PlaceholderMap = {[key: string]: string | PlaceholderMap };

export interface DndEditorConfig
{
    width?: Ruler,
    height?: Ruler,
    elementGroups: DndEditorElementGroup[],
    placeholder?: PlaceholderMap
}