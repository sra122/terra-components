import { Observable } from 'rxjs/Observable';
import { TerraPagerInterface } from '../../../pager/data/terra-pager.interface';
import { TerraPagerParameterInterface } from '../../../pager/data/terra-pager.parameter.interface';

export abstract class TerraLiveSearchService<T>
{
    public pagingData:TerraPagerInterface;
    public requestPending:boolean;

    constructor()
    {
        this.pagingData = {
            page:           1,
            itemsPerPage:   25,
            totalsCount:    1,
            isLastPage:     true,
            lastPageNumber: 1,
            lastOnPage:     1,
            firstOnPage:    1
        };
    }

    /**
     * @description Updates the stored paging data with the given data
     * @param {TerraPagerInterface} pagerData
     */
    public updatePagingData(pagerData:TerraPagerInterface):void
    {
        this.pagingData = {
            page:           pagerData.page,
            itemsPerPage:   pagerData.itemsPerPage,
            totalsCount:    pagerData.totalsCount,
            isLastPage:     pagerData.isLastPage,
            lastPageNumber: pagerData.lastPageNumber,
            firstOnPage:    pagerData.firstOnPage,
            lastOnPage:     pagerData.lastOnPage
        };
    }

    /**
     * @description Wrapper for the abstract requestTableData method. All the default behaviour when retrieving data is implemented here
     * @returns {Observable<TerraPagerInterface>}
     */
    public search(searchString:string):Observable<Array<T>>
    {
        // initialize pagination parameters
        let params:TerraPagerParameterInterface = {};

        // set page and itemsPerPage attribute
        if(this.pagingData && this.pagingData.page && this.pagingData.itemsPerPage)
        {
            params.page = this.pagingData.page;
            params.itemsPerPage = this.pagingData.itemsPerPage;
        }

        // request table data from the server
        this.requestPending = true;
        return this.requestData(searchString, params).map((response:TerraPagerInterface) =>
        {
            this.requestPending = false;
            this.updatePagingData(response);
            return response.entries;
        });
    }

    /**
     * @description Placeholder for the specific data-retrieval method. In General the specific rest call is given here.
     * @param {string} searchString
     * @param params
     * @returns {Observable<TerraPagerInterface>}
     */
    public abstract requestData(searchString:string, params:TerraPagerParameterInterface):Observable<TerraPagerInterface>;
}
