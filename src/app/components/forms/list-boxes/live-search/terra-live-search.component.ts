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
import { Observable } from 'rxjs/Observable';

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
    private _isTyping:boolean;

    private _onTouchedCallback:() => void;
    private _onChangeCallback:(_:any) => void;

    private readonly _minSearchStringLength:number;

    constructor(_elementRef:ElementRef)
    {
        super(_elementRef);

        this._minSearchStringLength = 3;

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
        // set default paging values
        this.resetPaging();

        // register debounced listener on input
        this._textInput.outputOnInput.do(() => this._isTyping = true).debounceTime(500).subscribe(() =>
        {
            this._isTyping = false;

            this.resetPaging();

            if(this._searchString.length >= this._minSearchStringLength)
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
        this.resetPaging();
    }

    private resetPaging():void
    {
        this.service.pagingData.page = 1;
        this.service.pagingData.itemsPerPage = 1;
    }

    private search():void
    {
        this.getSuggestions().subscribe((suggestions:Array<TerraSuggestionBoxValueInterface>) =>
        {
            this._suggestions = suggestions;
        });
    }

    private getSuggestions():Observable<Array<TerraSuggestionBoxValueInterface>>
    {
        return this.service.search(this._searchString).map((data:Array<T>) =>
        {
            return data.map(this.mappingFunction);
        });
    }

    private requestNextPage():void
    {
        this.service.pagingData.page++;
        this.getSuggestions().subscribe((suggestions:Array<TerraSuggestionBoxValueInterface>) =>
        {
            this._suggestions.push(...suggestions);
        });
    }
}
