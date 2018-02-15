import { Observable } from 'rxjs/Observable';

export abstract class TerraLiveSearchService<T>
{
    public abstract requestData(searchString:string):Observable<Array<T>>;
}
