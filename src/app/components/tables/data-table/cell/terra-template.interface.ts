export enum TerraTemplateEnum
{
    collapsibleRowWithChangedData = '<div>Test</div>'
}

export interface TerraTemplateInterface
{
    type:TerraTemplateEnum;
    value:string;
    func?:() => void;
}
