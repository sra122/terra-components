import {
    Component,
    forwardRef,
    Input,
    OnInit,
    ViewChild,
    ElementRef
} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import { TerraTextInputComponent } from '../../input/text-input/terra-text-input.component';
import { TerraSuggestionBoxValueInterface } from '../suggestion-box/data/terra-suggestion-box.interface';
import { TerraLiveSearchService } from './terra-live-search.service';
import { TerraListBoxBaseComponent } from '../base/terra-list-box-base.component';

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
export class TerraLiveSearchComponent<T> extends TerraListBoxBaseComponent implements ControlValueAccessor, OnInit
{
    /**
     * @description service that handles data retrieval
     */
    @Input()
    public service:TerraLiveSearchService<T>;

    /**
     * @description function that maps the data from the service to the values in the suggestion box
     */
    @Input()
    public mappingFunction:(value:T, index:number, array:T[]) => TerraSuggestionBoxValueInterface;

    /**
     * @description accesses text input element from the template
     */
    @ViewChild(TerraTextInputComponent)
    private _textInput:TerraTextInputComponent;

    private _value:TerraSuggestionBoxValueInterface;
    private _searchString:string;
    private _suggestions:Array<TerraSuggestionBoxValueInterface>;

    private _onTouchedCallback:() => void;
    private _onChangeCallback:(_:any) => void;

    private readonly _noEntriesTextKey:string = 'terraLiveSearch.noEntries';
    private readonly _noResultsTextKey:string = 'terraLiveSearch.noResults';

    constructor(_elementRef:ElementRef)
    {
        super(_elementRef);

        this._suggestions = [];
        this._searchString = '';
        this._onTouchedCallback = ():void =>
        {
            return;
        };
        this._onChangeCallback = ():void =>
        {
            return;
        };
    }

    public ngOnInit():void
    {
        this._textInput.outputOnInput.debounceTime(500).subscribe(() =>
        {
            if(this._searchString.length > 2)
            {
                this.search();
            }
            else
            {
                // reset suggestions
                this._suggestions = [];
            }
        });
    }

    public registerOnChange(fn:any):void
    {
        this._onChangeCallback = fn;
    }

    public registerOnTouched(fn:any):void
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
            this._searchString = this._value.caption;
        }
    }

    public select(value:TerraSuggestionBoxValueInterface):void
    {
        this.value = value;
    }

    private search():void
    {
        this.service.requestData(this._searchString).map((data:Array<T>) =>
        {
            return data.map(this.mappingFunction);
        }).subscribe((suggestions:Array<TerraSuggestionBoxValueInterface>) =>
        {
            this._suggestions = suggestions;
        });
    }

}
