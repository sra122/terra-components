import { Ruler } from '../helper/ruler.helper';
import { EditorComponentGroup } from './dnd-editor-component-group.interface';

export type PlaceholderMap = { [key:string]:string | PlaceholderMap };

/**
 * Configuration for DndEditorComponent
 */
export interface DndEditorConfig
{
    // The dimensions of the preview document.
    width?:Ruler;
    height?:Ruler;

    // available components
    componentGroups:EditorComponentGroup[];

    // available placeholders for PlaceholderDropzoneComponents
    placeholder?:PlaceholderMap;
}