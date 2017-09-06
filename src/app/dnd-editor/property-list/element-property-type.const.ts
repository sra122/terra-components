import { TextPropertyInputComponent } from './property-input/property-input-components/text-property-input/text-property-input.component';
import { ColorPropertyInputComponent } from './property-input/property-input-components/color-property-input/color-property-input.component';
import { CheckboxPropertyInputComponent } from './property-input/property-input-components/checkbox-property-input/checkbox-property-input.component';
import { SelectPropertyInputComponent } from './property-input/property-input-components/select-property-input/select-property-input.component';

export class ElementPropertyType
{
    public static readonly TEXT = TextPropertyInputComponent;
    public static readonly COLOR = ColorPropertyInputComponent;
    public static readonly CHECKBOX = CheckboxPropertyInputComponent;
    public static readonly SELECT = SelectPropertyInputComponent;
}