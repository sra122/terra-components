import { Component } from '@angular/core';
import { TerraLiveSearchServiceExample } from './terra-live-search.service.example';
import { TerraSuggestionBoxValueInterface } from '../../suggestion-box/data/terra-suggestion-box.interface';

@Component({
    selector: 'terra-live-search-example',
    template: require('./terra-live-search.component.example.html')
})
export class TerraLiveSearchComponentExample
{
    private mappingFcn:(value:any, index:number, array:any[]) => TerraSuggestionBoxValueInterface;

    constructor(private _liveSearchService:TerraLiveSearchServiceExample)
    {
        this.mappingFcn = (value:any, index:number, array:any[]):TerraSuggestionBoxValueInterface =>
        {
            return {
                value: value.id,
                caption: value.name
            };
        };
    }
}
