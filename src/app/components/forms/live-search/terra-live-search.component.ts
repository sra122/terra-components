import {
    Component,
    forwardRef,
    Input,
    ViewChild
} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import { TerraTextInputComponent } from '../input/text-input/terra-text-input.component';
import { Observable } from 'rxjs/Observable';
import { TerraSuggestionBoxValueInterface } from '../suggestion-box/data/terra-suggestion-box.interface';

@Component({
    selector:  'terra-live-search',
    styles:    [require('./terra-live-search.component.scss')],
    template:  require('./terra-live-search.component.html'),
    providers: [
        {
            provide:     NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TerraLiveSearchComponent),
            multi:       true
        }
    ]
})
export class TerraLiveSearchComponent<T> implements ControlValueAccessor
{
    @ViewChild(TerraTextInputComponent) public textInput:TerraTextInputComponent;
    @Input() public mappingFunction:(value: T, index: number, array: T[]) => TerraSuggestionBoxValueInterface;

    private _value:any;
    private _searchString:string;
    private _suggestions:Array<TerraSuggestionBoxValueInterface>;

    private _onTouchedCallback:() => void = () =>
    {
    };

    private _onChangeCallback:(_:any) => void = (_) =>
    {
    };

    constructor()
    {

    }

    ngOnInit():void
    {
        this.textInput.outputOnInput.debounceTime(500).subscribe(() =>
        {
            this.search(this._value).subscribe((values:T[]) =>
            {
                 values.map(this.mappingFunction, this._suggestions);
            });
        })
    }


    public registerOnChange(fn: any): void
    {
        this._onChangeCallback = fn;
    }
    public registerOnTouched(fn: any): void
    {
        this._onTouchedCallback = fn;
    }

    public writeValue(value:any):void
    {
        this.value = value;
    }

    public set value(v:any)
    {
        if(v !== this._value)
        {
            this._value = v;
            this._onChangeCallback(this._value);
        }
    }

    private search(_value:any):Observable<Array<T>>
    {
        let arr:T[];

        return Observable.of(arr);
    }
}
