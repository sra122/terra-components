import { Injectable } from '@angular/core';
import { TerraLiveSearchService } from '../terra-live-search.service';
import { Observable } from 'rxjs/Observable';
import { TerraPagerInterface } from '../../../../pager/data/terra-pager.interface';
import { TerraPagerParameterInterface } from '../../../../pager/data/terra-pager.parameter.interface';

@Injectable()
export class TerraLiveSearchServiceExample extends TerraLiveSearchService<any>
{
    private data:[{ id:number, name:string }] = [
        {
            name: 'haha',
            id:   1
        },
        {
            id: 2,
            name: 'bla'
        },
        {
            id: 3,
            name: 'hahahahaha'
        },
        {
            id: 4,
            name: 'hahaha'
        }
    ];

    public requestData(searchString:string, params:TerraPagerParameterInterface):Observable<TerraPagerInterface>
    {
        let data:any[] = this.data.filter((elem:any) => elem.name.toLowerCase().includes(searchString.toLowerCase()));

        // build up paging information
        let firstOnPage:number = Math.max((params.page - 1) * params.itemsPerPage, 0);
        let lastOnPage:number = Math.min(params.page * params.itemsPerPage, data.length);
        let lastPageNumber:number = Math.ceil(data.length / params.itemsPerPage);

        let result:TerraPagerInterface =
            {
                page:           params.page,
                itemsPerPage:   params.itemsPerPage,
                totalsCount:    data.length,
                isLastPage:     params.page === lastPageNumber,
                lastPageNumber: lastPageNumber,
                firstOnPage:    firstOnPage + 1,
                lastOnPage:     lastOnPage,
                entries:        data
            };

        // cut data that is not included in the requested page
        result.entries = result.entries.slice(firstOnPage, lastOnPage);

        console.log(result);
        return Observable.of(result);
    }
}
