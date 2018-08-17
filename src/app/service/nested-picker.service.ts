import { NestedDataInterface } from '../components/nested-data-picker/data/nested-data.interface';
import { TerraNestedDataPickerBaseService } from '../components/nested-data-picker/service/terra-nested-data-picker-base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isNullOrUndefined } from 'util';
import { TerraDynamicFormService } from '../..';
import { ElasticSyncInterface } from './elasic-sync.interface';

@Injectable()
export class NestedPickerService extends TerraNestedDataPickerBaseService<{}>
{
    constructor(private terraService:TerraDynamicFormService)
    {
        super();
    }

    public requestNestedData(parentId:string | number):Observable<Array<NestedDataInterface<{}>>>
    {

        let page:number = 1;
        return this.terraService.getNestedDataByParentID(parentId, page).expand((data:NestedDataInterface<{}>) =>
        {
            console.log(data, parentId);
            if(!data.isLastPage)
            {
                page++;
                return this.terraService.getNestedDataByParentID(parentId, page);
            }
            return Observable.empty();
        });

        // return this.terraService.getFieldValues('item_data').map(
        //     (results:any) =>
        //     {
        //         let nestedData:Array<NestedDataInterface<{}>> = [];

        //         Object.getOwnPropertyNames(results).map((key:string) =>
        //         {
        //             let nestedDataEntry:NestedDataInterface<{}> = {
        //                 key: key,
        //                 label: key,
        //                 isSelected: false
        //             };

        //             if (!isNullOrUndefined(results[key]))
        //             {
        //                 nestedDataEntry.children = [];
        //                 Object.getOwnPropertyNames(results[key]).map((child:string) =>
        //                 {
        //                     nestedDataEntry.children.push({
        //                         key: results[key][child]['fieldName'],
        //                         label: results[key][child]['label'],
        //                         isSelected: false
        //                     });
        //                 });
        //             }
        //             nestedData.push(nestedDataEntry);

        //         });
        //         return nestedData;
        //     }
        // );
    }

    public requestNestedDataById(id:number):Observable<Array<NestedDataInterface<{}>>>
    {
        return this.terraService.getNestedDataById(id);
    }
}
