import { Injectable } from '@angular/core';
import { TerraBaseService } from '../../../../service/terra-base.service';
import { TerraLoadingSpinnerService } from '../../../loading-spinner/service/terra-loading-spinner.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

/**
 * @author mfrank
 */
@Injectable()
export class TerraDynamicFormService extends TerraBaseService
{
    constructor(private _spinnerService:TerraLoadingSpinnerService,
                private _http:Http)
    {
        super(_spinnerService, _http, '', false);
    }

    /**
     * @param data
     * @param url
     * @return {any}
     */
    public create(data:any, url:string, params:any):Observable<any>
    {
        return Observable.of(data);
    }

    /**
     * @param data
     * @param url
     * @return {any}
     */
    public update(data:any, url:string, params:any):Observable<any>
    {
        return Observable.of(data);
    }

    /**
     * @param data
     * @param url
     * @return {any}
     */
    public delete(data:any, url:string):Observable<any>
    {
        return Observable.of(true);
    }

    public getFieldValues(syncType:string | number):Observable<any>
    {
        let url:string;
        url = 'http://master.plentymarkets.com/rest/elasticsync/mappings/values/item_data';
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZlOWY3Yzg5YTRmMDIzODZkOTMxNGIxY2U4ZDZkMTQyY2Y1ZGY0YjYxYmNhNjYyZDY0OWRhODUxM2Y0OGE4ZjZlZTkyZWE0MjQzMjVhZTE0In0.eyJhdWQiOiIxIiwianRpIjoiNmU5ZjdjODlhNGYwMjM4NmQ5MzE0YjFjZThkNmQxNDJjZjVkZjRiNjFiY2E2NjJkNjQ5ZGE4NTEzZjQ4YThmNmVlOTJlYTQyNDMyNWFlMTQiLCJpYXQiOjE1MzQ2MzAzNTAsIm5iZiI6MTUzNDYzMDM1MCwiZXhwIjoxNTM0NzE2NzUwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.QJMZkGo7DYvEZNRQQpXGaJOVvcnY8hx9oSE0UIUZPViqzm0nZjER-LqBFHDTIQO6Y8U0iuee60J9ETsdwnZwSwMnjv1gjuss5UcqDRX2Mx8sEeTC07ecYGjhNydEqLGObgVpsycRHJnOAtkNH6uDIeawDU2NTIXBVk1KNUJUqbzm0N5xOdSPbdsgOPlUiPtwnpych7vW0ahVNC1XPNAhtd_z1pgcnGRncL4WUSYsYMCmG5CcTvK_yKdb6p0SR9zyIM0wpIh2bNnmfBDjMi3qNXxTGiduSw09yYRKgfrt_ModjDvqlTOwR79jrSBLUD-mkUMy2jzCiC0Xv8CrrEur3Jvj84eYbBoq2NphxCIsF0hu2U74J_cp6Tw0QNPWZSQ3l2ndie2Qu5YzIg1-jQdm5KPWSzTnOYjmKoNRJJLxHqqeP168l78rdv9Z7tF6NjWk_MmB_1GnxWdta_UATMDoW_lEMcY_kMw-0AH8bQ0O38U0LyupdUN01JSrVWYz4WUqVNcQ2dBrVIPJiT1tEDrjwhGmfyshLFkPZF9uZP5NBnN-qIyzoODTvMhZAA2-ZRZN8wq8I47DGkuG6nBbrGqUTPNKxfCq1a4WILK0-228wVwnnxWgheDEgkgVTTyHDo36mO6gr54Kl3ufY8AL5_0KsKS0tH5_UmCBrOxgxL6MpV4');
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers
            })
        );
    }

    public getNestedDataById(syncId:string | number):Observable<any>
    {
        let url:string;
        url = 'http://master.plentymarkets.com/rest/elasticsync/mappings/values/item_data';
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZlOWY3Yzg5YTRmMDIzODZkOTMxNGIxY2U4ZDZkMTQyY2Y1ZGY0YjYxYmNhNjYyZDY0OWRhODUxM2Y0OGE4ZjZlZTkyZWE0MjQzMjVhZTE0In0.eyJhdWQiOiIxIiwianRpIjoiNmU5ZjdjODlhNGYwMjM4NmQ5MzE0YjFjZThkNmQxNDJjZjVkZjRiNjFiY2E2NjJkNjQ5ZGE4NTEzZjQ4YThmNmVlOTJlYTQyNDMyNWFlMTQiLCJpYXQiOjE1MzQ2MzAzNTAsIm5iZiI6MTUzNDYzMDM1MCwiZXhwIjoxNTM0NzE2NzUwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.QJMZkGo7DYvEZNRQQpXGaJOVvcnY8hx9oSE0UIUZPViqzm0nZjER-LqBFHDTIQO6Y8U0iuee60J9ETsdwnZwSwMnjv1gjuss5UcqDRX2Mx8sEeTC07ecYGjhNydEqLGObgVpsycRHJnOAtkNH6uDIeawDU2NTIXBVk1KNUJUqbzm0N5xOdSPbdsgOPlUiPtwnpych7vW0ahVNC1XPNAhtd_z1pgcnGRncL4WUSYsYMCmG5CcTvK_yKdb6p0SR9zyIM0wpIh2bNnmfBDjMi3qNXxTGiduSw09yYRKgfrt_ModjDvqlTOwR79jrSBLUD-mkUMy2jzCiC0Xv8CrrEur3Jvj84eYbBoq2NphxCIsF0hu2U74J_cp6Tw0QNPWZSQ3l2ndie2Qu5YzIg1-jQdm5KPWSzTnOYjmKoNRJJLxHqqeP168l78rdv9Z7tF6NjWk_MmB_1GnxWdta_UATMDoW_lEMcY_kMw-0AH8bQ0O38U0LyupdUN01JSrVWYz4WUqVNcQ2dBrVIPJiT1tEDrjwhGmfyshLFkPZF9uZP5NBnN-qIyzoODTvMhZAA2-ZRZN8wq8I47DGkuG6nBbrGqUTPNKxfCq1a4WILK0-228wVwnnxWgheDEgkgVTTyHDo36mO6gr54Kl3ufY8AL5_0KsKS0tH5_UmCBrOxgxL6MpV4');
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers
            })
        );
    }

    public getNestedDataByParentID(parentId?:string | number, page:number = 1):Observable<any>
    {
        let url:string;
        url = 'http://master.plentymarkets.com/rest/elasticsync/mappings/values/item_data';
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZlOWY3Yzg5YTRmMDIzODZkOTMxNGIxY2U4ZDZkMTQyY2Y1ZGY0YjYxYmNhNjYyZDY0OWRhODUxM2Y0OGE4ZjZlZTkyZWE0MjQzMjVhZTE0In0.eyJhdWQiOiIxIiwianRpIjoiNmU5ZjdjODlhNGYwMjM4NmQ5MzE0YjFjZThkNmQxNDJjZjVkZjRiNjFiY2E2NjJkNjQ5ZGE4NTEzZjQ4YThmNmVlOTJlYTQyNDMyNWFlMTQiLCJpYXQiOjE1MzQ2MzAzNTAsIm5iZiI6MTUzNDYzMDM1MCwiZXhwIjoxNTM0NzE2NzUwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.QJMZkGo7DYvEZNRQQpXGaJOVvcnY8hx9oSE0UIUZPViqzm0nZjER-LqBFHDTIQO6Y8U0iuee60J9ETsdwnZwSwMnjv1gjuss5UcqDRX2Mx8sEeTC07ecYGjhNydEqLGObgVpsycRHJnOAtkNH6uDIeawDU2NTIXBVk1KNUJUqbzm0N5xOdSPbdsgOPlUiPtwnpych7vW0ahVNC1XPNAhtd_z1pgcnGRncL4WUSYsYMCmG5CcTvK_yKdb6p0SR9zyIM0wpIh2bNnmfBDjMi3qNXxTGiduSw09yYRKgfrt_ModjDvqlTOwR79jrSBLUD-mkUMy2jzCiC0Xv8CrrEur3Jvj84eYbBoq2NphxCIsF0hu2U74J_cp6Tw0QNPWZSQ3l2ndie2Qu5YzIg1-jQdm5KPWSzTnOYjmKoNRJJLxHqqeP168l78rdv9Z7tF6NjWk_MmB_1GnxWdta_UATMDoW_lEMcY_kMw-0AH8bQ0O38U0LyupdUN01JSrVWYz4WUqVNcQ2dBrVIPJiT1tEDrjwhGmfyshLFkPZF9uZP5NBnN-qIyzoODTvMhZAA2-ZRZN8wq8I47DGkuG6nBbrGqUTPNKxfCq1a4WILK0-228wVwnnxWgheDEgkgVTTyHDo36mO6gr54Kl3ufY8AL5_0KsKS0tH5_UmCBrOxgxL6MpV4');
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers
            })
        );
    }

    public getCategories(parentId:string | number, page:any):Observable<any>
    {
        let url:string;
        url = 'http://master.plentymarkets.com/rest/categories';
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZlOWY3Yzg5YTRmMDIzODZkOTMxNGIxY2U4ZDZkMTQyY2Y1ZGY0YjYxYmNhNjYyZDY0OWRhODUxM2Y0OGE4ZjZlZTkyZWE0MjQzMjVhZTE0In0.eyJhdWQiOiIxIiwianRpIjoiNmU5ZjdjODlhNGYwMjM4NmQ5MzE0YjFjZThkNmQxNDJjZjVkZjRiNjFiY2E2NjJkNjQ5ZGE4NTEzZjQ4YThmNmVlOTJlYTQyNDMyNWFlMTQiLCJpYXQiOjE1MzQ2MzAzNTAsIm5iZiI6MTUzNDYzMDM1MCwiZXhwIjoxNTM0NzE2NzUwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.QJMZkGo7DYvEZNRQQpXGaJOVvcnY8hx9oSE0UIUZPViqzm0nZjER-LqBFHDTIQO6Y8U0iuee60J9ETsdwnZwSwMnjv1gjuss5UcqDRX2Mx8sEeTC07ecYGjhNydEqLGObgVpsycRHJnOAtkNH6uDIeawDU2NTIXBVk1KNUJUqbzm0N5xOdSPbdsgOPlUiPtwnpych7vW0ahVNC1XPNAhtd_z1pgcnGRncL4WUSYsYMCmG5CcTvK_yKdb6p0SR9zyIM0wpIh2bNnmfBDjMi3qNXxTGiduSw09yYRKgfrt_ModjDvqlTOwR79jrSBLUD-mkUMy2jzCiC0Xv8CrrEur3Jvj84eYbBoq2NphxCIsF0hu2U74J_cp6Tw0QNPWZSQ3l2ndie2Qu5YzIg1-jQdm5KPWSzTnOYjmKoNRJJLxHqqeP168l78rdv9Z7tF6NjWk_MmB_1GnxWdta_UATMDoW_lEMcY_kMw-0AH8bQ0O38U0LyupdUN01JSrVWYz4WUqVNcQ2dBrVIPJiT1tEDrjwhGmfyshLFkPZF9uZP5NBnN-qIyzoODTvMhZAA2-ZRZN8wq8I47DGkuG6nBbrGqUTPNKxfCq1a4WILK0-228wVwnnxWgheDEgkgVTTyHDo36mO6gr54Kl3ufY8AL5_0KsKS0tH5_UmCBrOxgxL6MpV4');
        return this.mapRequest(
            this.http.get(url,
                {
                    headers: this.headers
                })
        );
    }

    public getCategoryById(categoryId:number):Observable<any>
    {
        let url:string;
        url = 'http://master.plentymarkets.com/rest/categories' + categoryId;
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZlOWY3Yzg5YTRmMDIzODZkOTMxNGIxY2U4ZDZkMTQyY2Y1ZGY0YjYxYmNhNjYyZDY0OWRhODUxM2Y0OGE4ZjZlZTkyZWE0MjQzMjVhZTE0In0.eyJhdWQiOiIxIiwianRpIjoiNmU5ZjdjODlhNGYwMjM4NmQ5MzE0YjFjZThkNmQxNDJjZjVkZjRiNjFiY2E2NjJkNjQ5ZGE4NTEzZjQ4YThmNmVlOTJlYTQyNDMyNWFlMTQiLCJpYXQiOjE1MzQ2MzAzNTAsIm5iZiI6MTUzNDYzMDM1MCwiZXhwIjoxNTM0NzE2NzUwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.QJMZkGo7DYvEZNRQQpXGaJOVvcnY8hx9oSE0UIUZPViqzm0nZjER-LqBFHDTIQO6Y8U0iuee60J9ETsdwnZwSwMnjv1gjuss5UcqDRX2Mx8sEeTC07ecYGjhNydEqLGObgVpsycRHJnOAtkNH6uDIeawDU2NTIXBVk1KNUJUqbzm0N5xOdSPbdsgOPlUiPtwnpych7vW0ahVNC1XPNAhtd_z1pgcnGRncL4WUSYsYMCmG5CcTvK_yKdb6p0SR9zyIM0wpIh2bNnmfBDjMi3qNXxTGiduSw09yYRKgfrt_ModjDvqlTOwR79jrSBLUD-mkUMy2jzCiC0Xv8CrrEur3Jvj84eYbBoq2NphxCIsF0hu2U74J_cp6Tw0QNPWZSQ3l2ndie2Qu5YzIg1-jQdm5KPWSzTnOYjmKoNRJJLxHqqeP168l78rdv9Z7tF6NjWk_MmB_1GnxWdta_UATMDoW_lEMcY_kMw-0AH8bQ0O38U0LyupdUN01JSrVWYz4WUqVNcQ2dBrVIPJiT1tEDrjwhGmfyshLFkPZF9uZP5NBnN-qIyzoODTvMhZAA2-ZRZN8wq8I47DGkuG6nBbrGqUTPNKxfCq1a4WILK0-228wVwnnxWgheDEgkgVTTyHDo36mO6gr54Kl3ufY8AL5_0KsKS0tH5_UmCBrOxgxL6MpV4');
        return this.mapRequest(
            this.http.get(url,
                {
                    headers: this.headers
                })
        );
    }

    public getCategoryBranches():Observable<any>
    {
        let url:string;
        url = 'http://master.plentymarkets.com/rest/category_branches';
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZlOWY3Yzg5YTRmMDIzODZkOTMxNGIxY2U4ZDZkMTQyY2Y1ZGY0YjYxYmNhNjYyZDY0OWRhODUxM2Y0OGE4ZjZlZTkyZWE0MjQzMjVhZTE0In0.eyJhdWQiOiIxIiwianRpIjoiNmU5ZjdjODlhNGYwMjM4NmQ5MzE0YjFjZThkNmQxNDJjZjVkZjRiNjFiY2E2NjJkNjQ5ZGE4NTEzZjQ4YThmNmVlOTJlYTQyNDMyNWFlMTQiLCJpYXQiOjE1MzQ2MzAzNTAsIm5iZiI6MTUzNDYzMDM1MCwiZXhwIjoxNTM0NzE2NzUwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.QJMZkGo7DYvEZNRQQpXGaJOVvcnY8hx9oSE0UIUZPViqzm0nZjER-LqBFHDTIQO6Y8U0iuee60J9ETsdwnZwSwMnjv1gjuss5UcqDRX2Mx8sEeTC07ecYGjhNydEqLGObgVpsycRHJnOAtkNH6uDIeawDU2NTIXBVk1KNUJUqbzm0N5xOdSPbdsgOPlUiPtwnpych7vW0ahVNC1XPNAhtd_z1pgcnGRncL4WUSYsYMCmG5CcTvK_yKdb6p0SR9zyIM0wpIh2bNnmfBDjMi3qNXxTGiduSw09yYRKgfrt_ModjDvqlTOwR79jrSBLUD-mkUMy2jzCiC0Xv8CrrEur3Jvj84eYbBoq2NphxCIsF0hu2U74J_cp6Tw0QNPWZSQ3l2ndie2Qu5YzIg1-jQdm5KPWSzTnOYjmKoNRJJLxHqqeP168l78rdv9Z7tF6NjWk_MmB_1GnxWdta_UATMDoW_lEMcY_kMw-0AH8bQ0O38U0LyupdUN01JSrVWYz4WUqVNcQ2dBrVIPJiT1tEDrjwhGmfyshLFkPZF9uZP5NBnN-qIyzoODTvMhZAA2-ZRZN8wq8I47DGkuG6nBbrGqUTPNKxfCq1a4WILK0-228wVwnnxWgheDEgkgVTTyHDo36mO6gr54Kl3ufY8AL5_0KsKS0tH5_UmCBrOxgxL6MpV4');
        return this.mapRequest(
            this.http.get(this.url,
                {
                    headers: this.headers
                })
        );
    }

    public getCategoriesByParentID(parentId?:string | number, page:number = 1):Observable<any>
    {
        let url:string;
        url = 'http://master.plentymarkets.com/rest/categories?parentId=' + parentId + '&page=' + page;
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZlOWY3Yzg5YTRmMDIzODZkOTMxNGIxY2U4ZDZkMTQyY2Y1ZGY0YjYxYmNhNjYyZDY0OWRhODUxM2Y0OGE4ZjZlZTkyZWE0MjQzMjVhZTE0In0.eyJhdWQiOiIxIiwianRpIjoiNmU5ZjdjODlhNGYwMjM4NmQ5MzE0YjFjZThkNmQxNDJjZjVkZjRiNjFiY2E2NjJkNjQ5ZGE4NTEzZjQ4YThmNmVlOTJlYTQyNDMyNWFlMTQiLCJpYXQiOjE1MzQ2MzAzNTAsIm5iZiI6MTUzNDYzMDM1MCwiZXhwIjoxNTM0NzE2NzUwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.QJMZkGo7DYvEZNRQQpXGaJOVvcnY8hx9oSE0UIUZPViqzm0nZjER-LqBFHDTIQO6Y8U0iuee60J9ETsdwnZwSwMnjv1gjuss5UcqDRX2Mx8sEeTC07ecYGjhNydEqLGObgVpsycRHJnOAtkNH6uDIeawDU2NTIXBVk1KNUJUqbzm0N5xOdSPbdsgOPlUiPtwnpych7vW0ahVNC1XPNAhtd_z1pgcnGRncL4WUSYsYMCmG5CcTvK_yKdb6p0SR9zyIM0wpIh2bNnmfBDjMi3qNXxTGiduSw09yYRKgfrt_ModjDvqlTOwR79jrSBLUD-mkUMy2jzCiC0Xv8CrrEur3Jvj84eYbBoq2NphxCIsF0hu2U74J_cp6Tw0QNPWZSQ3l2ndie2Qu5YzIg1-jQdm5KPWSzTnOYjmKoNRJJLxHqqeP168l78rdv9Z7tF6NjWk_MmB_1GnxWdta_UATMDoW_lEMcY_kMw-0AH8bQ0O38U0LyupdUN01JSrVWYz4WUqVNcQ2dBrVIPJiT1tEDrjwhGmfyshLFkPZF9uZP5NBnN-qIyzoODTvMhZAA2-ZRZN8wq8I47DGkuG6nBbrGqUTPNKxfCq1a4WILK0-228wVwnnxWgheDEgkgVTTyHDo36mO6gr54Kl3ufY8AL5_0KsKS0tH5_UmCBrOxgxL6MpV4');
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers
            })
        );
    }
}
