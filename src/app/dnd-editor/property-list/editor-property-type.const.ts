import { TextPropertyInputComponent } from './property-input/property-input-components/text-property-input/text-property-input.component';
import { ColorPropertyInputComponent } from './property-input/property-input-components/color-property-input/color-property-input.component';
import { CheckboxPropertyInputComponent } from './property-input/property-input-components/checkbox-property-input/checkbox-property-input.component';
import { SelectPropertyInputComponent } from './property-input/property-input-components/select-property-input/select-property-input.component';
import { SliderPropertyInputComponent } from './property-input/property-input-components/slider-property-input/slider-property-input.component';
import { FilePropertyInputComponent } from './property-input/property-input-components/file-property-input/file-property-input.component';

/**
 * Collection of built-in editor property input components
 */
export class EditorPropertyType
{
    public static readonly TEXT = TextPropertyInputComponent;
    public static readonly COLOR = ColorPropertyInputComponent;
    public static readonly CHECKBOX = CheckboxPropertyInputComponent;
    public static readonly SELECT = SelectPropertyInputComponent;
    public static readonly SLIDER = SliderPropertyInputComponent;
    public static readonly FILE = FilePropertyInputComponent;
}