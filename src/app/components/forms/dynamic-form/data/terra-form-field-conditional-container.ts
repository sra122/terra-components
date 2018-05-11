import {
    TerraFormFieldBase,
    TerraFormFieldBaseOptions
} from './terra-form-field-base';
import { TerraSelectBoxValueInterface } from '../../select-box/data/terra-select-box.interface';
import { TerraControlTypeEnum } from '../enum/terra-control-type.enum';

/**
 * @author mfrank
 */
export interface TerraFormFieldConditionalContainerOptions extends TerraFormFieldBaseOptions<string>
{
    conditionalValues?:Array<TerraSelectBoxValueInterface> | Array<{ [key:string]:string | number | boolean }>;
    conditionalEntries?:{ [key:string]:Array<TerraFormFieldBase<any>> };
}

/**
 * @deprecated
 */
export class TerraFormFieldConditionalContainer extends TerraFormFieldBase<string>
{
    public conditionalType:string;
    public conditionalValues:Array<TerraSelectBoxValueInterface> | Array<{ [key:string]:string | number | boolean }>;
    public conditionalEntries:{ [key:string]:Array<TerraFormFieldBase<any>> };

    constructor(key:string, conditionalType:string, label:string, options:TerraFormFieldConditionalContainerOptions = {})
    {
        super(key, TerraControlTypeEnum.CONDITIONAL_CONTAINER, label, false, options);

        this.conditionalType = conditionalType;
        this.conditionalValues = options['conditionalValues'] || [];
        this.conditionalEntries = options['conditionalEntries'] || {};
    }
}
