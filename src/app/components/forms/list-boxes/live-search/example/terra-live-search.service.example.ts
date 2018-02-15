import { Injectable } from '@angular/core';
import { TerraLiveSearchService } from '../terra-live-search.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TerraLiveSearchServiceExample extends TerraLiveSearchService<any>
{
    public requestData(searchString:string):Observable<Array<any>>
    {
        console.log('data requested');
        let data:any[] = [
            {
                name: 'haha',
                id: 1
            }
        ];
        return Observable.of(data.filter((elem:any) => elem.name.toLowerCase().includes(searchString.toLowerCase())));
    }
}
