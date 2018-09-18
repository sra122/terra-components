import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { TerraSelectBoxValueInterface } from './data/terra-select-box.interface';
import {
    FormControl,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
    isNull,
    isNullOrUndefined
} from 'util';
import { StringHelper } from '../../../helpers/string.helper';
import { TerraSelectBoxBase } from '../selection/terra-select-box.base';

@Component({
    selector:  'terra-select-box',
    styles:    [require('./terra-select-box.component.scss')],
    template:  require('./terra-select-box.component.html'),
    providers: [
        {
            provide:     NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TerraSelectBoxComponent),
            multi:       true
        }
    ]
})
export class TerraSelectBoxComponent extends TerraSelectBoxBase implements OnInit, OnChanges
{
    @Input()
    public inputName:string;

    @Input()
    public inputIsRequired:boolean;

    @Input()
    public inputIsDisabled:boolean;

    @Input()
    public inputIsSmall:boolean;

    @Input()
    public inputOpenOnTop:boolean;

    @Input()
    public inputTooltipText:string;

    @Input()
    public inputTooltipPlacement:string;

    /**
     * @deprecated
     */
    @Output()
    public outputValueChanged:EventEmitter<TerraSelectBoxValueInterface> = new EventEmitter<TerraSelectBoxValueInterface>();

    @Output()
    public inputSelectedValueChange:EventEmitter<TerraSelectBoxValueInterface> = new EventEmitter<TerraSelectBoxValueInterface>();

    public isValid:boolean;

    protected hasLabel:boolean;

    private _value:number | string;
    private isInit:boolean;

    /**
     * @deprecated
     * @param value
     */
    @Input()
    public set inputSelectedValue(value:number | string)
    {
        console.warn('inputSelectedValue is deprecated. It will be removed in one of the upcoming releases. Please use ngModel instead.');
        if(!isNullOrUndefined(value))
        {
            this.inputListBoxValues
                .forEach((item:TerraSelectBoxValueInterface) =>
                {
                    if(item.value === value)
                    {
                        this.selectedValue = item;
                    }
                });

            this.inputSelectedValueChange.emit(this.selectedValue.value);
        }
    }

    public get inputSelectedValue():number | string
    {
        return this.selectedValue.value;
    }

    /**
     *
     * @param elementRef
     */
    constructor(elementRef:ElementRef)
    {
        super(elementRef);

        this.isInit = false;
        this.inputTooltipPlacement = 'top';
        this.inputIsSmall = false;
        this.inputOpenOnTop = false;
    }

    public ngOnInit():void
    {
        this.isValid = true;
        this.hasLabel = !isNull(this.inputName);
        this.isInit = true;
    }

    /**
     *
     * @param changes
     */
    public ngOnChanges(changes:SimpleChanges):void
    {
        if(this.isInit === true
           && changes['inputListBoxValues']
           && changes['inputListBoxValues'].currentValue.length > 0
           && !this.inputListBoxValues.find((x:TerraSelectBoxValueInterface):boolean => this.selectedValue === x))
        {
            this.select(this.inputListBoxValues[0]);
        }
    }

    public registerOnChange(fn:(_:any) => void):void
    {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn:() => void):void
    {
        this.onTouchedCallback = fn;
    }

    /**
     *
     * Two way data binding by ngModel
     */
    private onTouchedCallback:() => void = ():void => undefined;

    private onChangeCallback:(_:any) => void = (_:any):void => undefined;

    public writeValue(value:any):void
    {
        this.value = value;
    }

    public get emptyValueSelected():boolean
    {
        return isNullOrUndefined(this.selectedValue) ||
               (StringHelper.isNullUndefinedOrEmpty(this.selectedValue.caption.toString()) &&
                StringHelper.isNullUndefinedOrEmpty(this.selectedValue.icon));
    }

    public get value():any
    {
        return this._value;
    }

    public set value(value:any)
    {
        this._value = value;

        if(!isNullOrUndefined(value))
        {
            this.inputListBoxValues
                .forEach((item:TerraSelectBoxValueInterface) =>
                {
                    if(item.value === value)
                    {
                        this.selectedValue = item;
                    }
                });
        }
        else if(!isNullOrUndefined(this.inputListBoxValues[0]))
        {
            this.selectedValue = this.inputListBoxValues[0];
            this.onTouchedCallback();
            this.onChangeCallback(this.inputListBoxValues[0].value);
        }
    }


    /**
     *
     * @param value
     */
    private select(value:TerraSelectBoxValueInterface):void
    {
        if(isNullOrUndefined(this.selectedValue) || this.selectedValue.value !== value.value)
        {
            this.onChangeCallback(value.value);
            this.outputValueChanged.emit(value);
        }

        this.selectedValue = value;
        this.onTouchedCallback();
    }

    public validate(formControl:FormControl):void
    {
        if(formControl.valid)
        {
            this.isValid = true;
        }
        else
        {
            if(!this.inputIsDisabled)
            {
                this.isValid = false;
            }
        }
    }
}
