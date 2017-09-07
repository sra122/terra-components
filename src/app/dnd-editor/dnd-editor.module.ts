import { DndEditorCompontent } from './dnd-editor.component';
import { ElementListComponent } from './element-list/element-list.component';
import { ElementDropzoneComponent } from './element-dropzone/element-dropzone.component';
import { ElementContainerComponent } from './element-container/element-container.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { ElementPropertyInputComponent } from './property-list/property-input/property-input.component';
import { ElementPropertyInputListComponent } from './property-list/property-input-list/property-input-list.component';
import { TextPropertyInputComponent } from './property-list/property-input/property-input-components/text-property-input/text-property-input.component';
import { ColorPropertyInputComponent } from './property-list/property-input/property-input-components/color-property-input/color-property-input.component';
import { CheckboxPropertyInputComponent } from './property-list/property-input/property-input-components/checkbox-property-input/checkbox-property-input.component';
import { SelectPropertyInputComponent } from './property-list/property-input/property-input-components/select-property-input/select-property-input.component';
import { PlaceholderListComponent } from './placeholder-list/placeholder-list.component';
import { PlaceholderDropzoneComponent } from './placeholder-dropzone/placeholder-dropzone.component';
import { SliderPropertyInputComponent } from './property-list/property-input/property-input-components/slider-property-input/slider-property-input.component';
import { FilePropertyInputComponent } from './property-list/property-input/property-input-components/file-property-input/file-property-input.component';


export const DND_EDITOR_DECLARATIONS = [
    DndEditorCompontent,
    ElementListComponent,
    ElementDropzoneComponent,
    ElementContainerComponent,
    PropertyListComponent,
    PlaceholderListComponent,
    PlaceholderDropzoneComponent,
    ElementPropertyInputComponent,
    ElementPropertyInputListComponent,
    TextPropertyInputComponent,
    ColorPropertyInputComponent,
    CheckboxPropertyInputComponent,
    SelectPropertyInputComponent,
    SliderPropertyInputComponent,
    FilePropertyInputComponent,
];

export const DND_EDITOR_ENTRY_COMPONENTS = [
    ElementContainerComponent,
    TextPropertyInputComponent,
    ColorPropertyInputComponent,
    CheckboxPropertyInputComponent,
    SelectPropertyInputComponent,
    SliderPropertyInputComponent,
    FilePropertyInputComponent,
];

export const DND_EDITOR_EXPORTS = [
    DndEditorCompontent,
    ElementDropzoneComponent,
    ElementContainerComponent,
    PlaceholderDropzoneComponent,
];