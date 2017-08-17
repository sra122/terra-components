import { Ruler } from "../helper/ruler.helper";
import { DndEditorElement } from "./dnd-editor-element.interface";
import { DndEditorElementGroup } from "./dnd-editor-element-group.interface";
export interface DndEditorConfig
{
    width?: Ruler,
    height?: Ruler,
    elementGroups: DndEditorElementGroup[];
}