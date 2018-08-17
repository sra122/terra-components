import { TerraCategoryPickerBaseService } from './../components/category-picker/service/terra-category-picker-base.service';
import { CategoryDataInterface } from './../components/category-picker/data/category-data.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CategoryPagerDataInterface } from './../components/category-picker/data/category-pager-data.interface';
import { TerraDynamicFormService } from './../components/forms/dynamic-form/service/terra-dynamic-form.service';

@Injectable()
export class CategoryPickerService extends TerraCategoryPickerBaseService
{
    constructor(private categoryService:TerraDynamicFormService)
    {
        super();
    }

    public requestCategoryData(parentId?:string | number):Observable<CategoryPagerDataInterface>
    {
        let page:number = 1;
        return this.categoryService.getCategoriesByParentID(parentId, page).expand((data:CategoryPagerDataInterface) =>
        {
            console.log(data, parentId);
            if(!data.isLastPage)
            {
                page++;
                return this.categoryService.getCategoriesByParentID(parentId, page);
            }
            return Observable.empty();
        });

    }

    public requestCategoryDataById(id:number):Observable<CategoryPagerDataInterface>
    {
        return this.categoryService.getCategoryById(id);
    }
}
