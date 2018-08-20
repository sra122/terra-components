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
        url = 'http://master.plentymarkets.com/rest/categories';
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1ZDExYjE3NTRlM2Q1YTVkODI0MjRmZDFiNmEyNjQ0ZWU4Y2NmYjk2NmIyNTU1Mjg3ZDkyOWY0MzQxODEwYjY2ZTJmNjAzMzMxMzYzNDQ0In0.eyJhdWQiOiIxIiwianRpIjoiNjVkMTFiMTc1NGUzZDVhNWQ4MjQyNGZkMWI2YTI2NDRlZThjY2ZiOTY2YjI1NTUyODdkOTI5ZjQzNDE4MTBiNjZlMmY2MDMzMzEzNjM0NDQiLCJpYXQiOjE1MzQ3NDQ5MjUsIm5iZiI6MTUzNDc0NDkyNSwiZXhwIjoxNTM0ODMxMzI1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.Ljfs-buhGpl3_DIpweYywTDtIg4NajFbdMZiNCaiQbnEXiThFwEb3iDxFg0zO5QttdafI1Nzkd00GRgHgPE_cra4PkJC0YFj7No8ezhSj3FuzlR4nlGntFy1ZJgOMBmCryOPFs-JQ0ob92Tg_DBclAKyfOEwMtib15KOqb1g9BsLz2qFi40VafE7v1zxmxRd54vnGxUZb-7w5fNaPn8smN99e6-LFdXU460SyViQjhrFR29yatDOfFpe-9PifmMC-AIctGKRawFFbXDBsDxBU3oCBFAiWHzOl-v9o-ZdLKNtUv5RCOagaUdXYR2gTpn04cM6q8TFbAOa-pU78tB3ExZPvioo3uVfF0rZySo8MoxhXbDAbuaikE_pEWsUqoX7pdCgrAgjYLfILTJfxKRdkamp2dPK2q4NzeqZKT81LNjEQG6mxE9jt6OsqhyytZ7t2cU3vrmIL_o88xTpzQniXGfVqjl_S-t5hXcyQs9vVZH2CDlkQhyIZ1nt5YPkDXt91hujwDBO3HHqVraRGn2MfJ299MnDal6nYw3RjVitPH-TiJHacgJndV5nEYfjMCyoSuAm4ouqQfla06JPMoLQAI_hjxDLsu5S78AXX8gEkV3lLXR5UUPuxKVayg90o8_PEhMMQAZR-JbIBiV3yEpi3PN-0TH1S5izLb52MdV9zMs');
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers
            })
        );
    }

    public getNestedDataById(syncId:string | number):Observable<any>
    {
        let url:string;
        url = 'http://master.plentymarkets.com/rest/categories' + syncId;
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1ZDExYjE3NTRlM2Q1YTVkODI0MjRmZDFiNmEyNjQ0ZWU4Y2NmYjk2NmIyNTU1Mjg3ZDkyOWY0MzQxODEwYjY2ZTJmNjAzMzMxMzYzNDQ0In0.eyJhdWQiOiIxIiwianRpIjoiNjVkMTFiMTc1NGUzZDVhNWQ4MjQyNGZkMWI2YTI2NDRlZThjY2ZiOTY2YjI1NTUyODdkOTI5ZjQzNDE4MTBiNjZlMmY2MDMzMzEzNjM0NDQiLCJpYXQiOjE1MzQ3NDQ5MjUsIm5iZiI6MTUzNDc0NDkyNSwiZXhwIjoxNTM0ODMxMzI1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.Ljfs-buhGpl3_DIpweYywTDtIg4NajFbdMZiNCaiQbnEXiThFwEb3iDxFg0zO5QttdafI1Nzkd00GRgHgPE_cra4PkJC0YFj7No8ezhSj3FuzlR4nlGntFy1ZJgOMBmCryOPFs-JQ0ob92Tg_DBclAKyfOEwMtib15KOqb1g9BsLz2qFi40VafE7v1zxmxRd54vnGxUZb-7w5fNaPn8smN99e6-LFdXU460SyViQjhrFR29yatDOfFpe-9PifmMC-AIctGKRawFFbXDBsDxBU3oCBFAiWHzOl-v9o-ZdLKNtUv5RCOagaUdXYR2gTpn04cM6q8TFbAOa-pU78tB3ExZPvioo3uVfF0rZySo8MoxhXbDAbuaikE_pEWsUqoX7pdCgrAgjYLfILTJfxKRdkamp2dPK2q4NzeqZKT81LNjEQG6mxE9jt6OsqhyytZ7t2cU3vrmIL_o88xTpzQniXGfVqjl_S-t5hXcyQs9vVZH2CDlkQhyIZ1nt5YPkDXt91hujwDBO3HHqVraRGn2MfJ299MnDal6nYw3RjVitPH-TiJHacgJndV5nEYfjMCyoSuAm4ouqQfla06JPMoLQAI_hjxDLsu5S78AXX8gEkV3lLXR5UUPuxKVayg90o8_PEhMMQAZR-JbIBiV3yEpi3PN-0TH1S5izLb52MdV9zMs');
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers
            })
        );
    }

    public getNestedDataByParentID(parentId?:string | number, page:number = 1):Observable<any>
    {
        let url:string;
        url = 'http://master.plentymarkets.com/rest/categories?parentId=' + parentId + '&page=' + page;
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1ZDExYjE3NTRlM2Q1YTVkODI0MjRmZDFiNmEyNjQ0ZWU4Y2NmYjk2NmIyNTU1Mjg3ZDkyOWY0MzQxODEwYjY2ZTJmNjAzMzMxMzYzNDQ0In0.eyJhdWQiOiIxIiwianRpIjoiNjVkMTFiMTc1NGUzZDVhNWQ4MjQyNGZkMWI2YTI2NDRlZThjY2ZiOTY2YjI1NTUyODdkOTI5ZjQzNDE4MTBiNjZlMmY2MDMzMzEzNjM0NDQiLCJpYXQiOjE1MzQ3NDQ5MjUsIm5iZiI6MTUzNDc0NDkyNSwiZXhwIjoxNTM0ODMxMzI1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.Ljfs-buhGpl3_DIpweYywTDtIg4NajFbdMZiNCaiQbnEXiThFwEb3iDxFg0zO5QttdafI1Nzkd00GRgHgPE_cra4PkJC0YFj7No8ezhSj3FuzlR4nlGntFy1ZJgOMBmCryOPFs-JQ0ob92Tg_DBclAKyfOEwMtib15KOqb1g9BsLz2qFi40VafE7v1zxmxRd54vnGxUZb-7w5fNaPn8smN99e6-LFdXU460SyViQjhrFR29yatDOfFpe-9PifmMC-AIctGKRawFFbXDBsDxBU3oCBFAiWHzOl-v9o-ZdLKNtUv5RCOagaUdXYR2gTpn04cM6q8TFbAOa-pU78tB3ExZPvioo3uVfF0rZySo8MoxhXbDAbuaikE_pEWsUqoX7pdCgrAgjYLfILTJfxKRdkamp2dPK2q4NzeqZKT81LNjEQG6mxE9jt6OsqhyytZ7t2cU3vrmIL_o88xTpzQniXGfVqjl_S-t5hXcyQs9vVZH2CDlkQhyIZ1nt5YPkDXt91hujwDBO3HHqVraRGn2MfJ299MnDal6nYw3RjVitPH-TiJHacgJndV5nEYfjMCyoSuAm4ouqQfla06JPMoLQAI_hjxDLsu5S78AXX8gEkV3lLXR5UUPuxKVayg90o8_PEhMMQAZR-JbIBiV3yEpi3PN-0TH1S5izLb52MdV9zMs');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1ZDExYjE3NTRlM2Q1YTVkODI0MjRmZDFiNmEyNjQ0ZWU4Y2NmYjk2NmIyNTU1Mjg3ZDkyOWY0MzQxODEwYjY2ZTJmNjAzMzMxMzYzNDQ0In0.eyJhdWQiOiIxIiwianRpIjoiNjVkMTFiMTc1NGUzZDVhNWQ4MjQyNGZkMWI2YTI2NDRlZThjY2ZiOTY2YjI1NTUyODdkOTI5ZjQzNDE4MTBiNjZlMmY2MDMzMzEzNjM0NDQiLCJpYXQiOjE1MzQ3NDQ5MjUsIm5iZiI6MTUzNDc0NDkyNSwiZXhwIjoxNTM0ODMxMzI1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.Ljfs-buhGpl3_DIpweYywTDtIg4NajFbdMZiNCaiQbnEXiThFwEb3iDxFg0zO5QttdafI1Nzkd00GRgHgPE_cra4PkJC0YFj7No8ezhSj3FuzlR4nlGntFy1ZJgOMBmCryOPFs-JQ0ob92Tg_DBclAKyfOEwMtib15KOqb1g9BsLz2qFi40VafE7v1zxmxRd54vnGxUZb-7w5fNaPn8smN99e6-LFdXU460SyViQjhrFR29yatDOfFpe-9PifmMC-AIctGKRawFFbXDBsDxBU3oCBFAiWHzOl-v9o-ZdLKNtUv5RCOagaUdXYR2gTpn04cM6q8TFbAOa-pU78tB3ExZPvioo3uVfF0rZySo8MoxhXbDAbuaikE_pEWsUqoX7pdCgrAgjYLfILTJfxKRdkamp2dPK2q4NzeqZKT81LNjEQG6mxE9jt6OsqhyytZ7t2cU3vrmIL_o88xTpzQniXGfVqjl_S-t5hXcyQs9vVZH2CDlkQhyIZ1nt5YPkDXt91hujwDBO3HHqVraRGn2MfJ299MnDal6nYw3RjVitPH-TiJHacgJndV5nEYfjMCyoSuAm4ouqQfla06JPMoLQAI_hjxDLsu5S78AXX8gEkV3lLXR5UUPuxKVayg90o8_PEhMMQAZR-JbIBiV3yEpi3PN-0TH1S5izLb52MdV9zMs');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1ZDExYjE3NTRlM2Q1YTVkODI0MjRmZDFiNmEyNjQ0ZWU4Y2NmYjk2NmIyNTU1Mjg3ZDkyOWY0MzQxODEwYjY2ZTJmNjAzMzMxMzYzNDQ0In0.eyJhdWQiOiIxIiwianRpIjoiNjVkMTFiMTc1NGUzZDVhNWQ4MjQyNGZkMWI2YTI2NDRlZThjY2ZiOTY2YjI1NTUyODdkOTI5ZjQzNDE4MTBiNjZlMmY2MDMzMzEzNjM0NDQiLCJpYXQiOjE1MzQ3NDQ5MjUsIm5iZiI6MTUzNDc0NDkyNSwiZXhwIjoxNTM0ODMxMzI1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.Ljfs-buhGpl3_DIpweYywTDtIg4NajFbdMZiNCaiQbnEXiThFwEb3iDxFg0zO5QttdafI1Nzkd00GRgHgPE_cra4PkJC0YFj7No8ezhSj3FuzlR4nlGntFy1ZJgOMBmCryOPFs-JQ0ob92Tg_DBclAKyfOEwMtib15KOqb1g9BsLz2qFi40VafE7v1zxmxRd54vnGxUZb-7w5fNaPn8smN99e6-LFdXU460SyViQjhrFR29yatDOfFpe-9PifmMC-AIctGKRawFFbXDBsDxBU3oCBFAiWHzOl-v9o-ZdLKNtUv5RCOagaUdXYR2gTpn04cM6q8TFbAOa-pU78tB3ExZPvioo3uVfF0rZySo8MoxhXbDAbuaikE_pEWsUqoX7pdCgrAgjYLfILTJfxKRdkamp2dPK2q4NzeqZKT81LNjEQG6mxE9jt6OsqhyytZ7t2cU3vrmIL_o88xTpzQniXGfVqjl_S-t5hXcyQs9vVZH2CDlkQhyIZ1nt5YPkDXt91hujwDBO3HHqVraRGn2MfJ299MnDal6nYw3RjVitPH-TiJHacgJndV5nEYfjMCyoSuAm4ouqQfla06JPMoLQAI_hjxDLsu5S78AXX8gEkV3lLXR5UUPuxKVayg90o8_PEhMMQAZR-JbIBiV3yEpi3PN-0TH1S5izLb52MdV9zMs');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1ZDExYjE3NTRlM2Q1YTVkODI0MjRmZDFiNmEyNjQ0ZWU4Y2NmYjk2NmIyNTU1Mjg3ZDkyOWY0MzQxODEwYjY2ZTJmNjAzMzMxMzYzNDQ0In0.eyJhdWQiOiIxIiwianRpIjoiNjVkMTFiMTc1NGUzZDVhNWQ4MjQyNGZkMWI2YTI2NDRlZThjY2ZiOTY2YjI1NTUyODdkOTI5ZjQzNDE4MTBiNjZlMmY2MDMzMzEzNjM0NDQiLCJpYXQiOjE1MzQ3NDQ5MjUsIm5iZiI6MTUzNDc0NDkyNSwiZXhwIjoxNTM0ODMxMzI1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.Ljfs-buhGpl3_DIpweYywTDtIg4NajFbdMZiNCaiQbnEXiThFwEb3iDxFg0zO5QttdafI1Nzkd00GRgHgPE_cra4PkJC0YFj7No8ezhSj3FuzlR4nlGntFy1ZJgOMBmCryOPFs-JQ0ob92Tg_DBclAKyfOEwMtib15KOqb1g9BsLz2qFi40VafE7v1zxmxRd54vnGxUZb-7w5fNaPn8smN99e6-LFdXU460SyViQjhrFR29yatDOfFpe-9PifmMC-AIctGKRawFFbXDBsDxBU3oCBFAiWHzOl-v9o-ZdLKNtUv5RCOagaUdXYR2gTpn04cM6q8TFbAOa-pU78tB3ExZPvioo3uVfF0rZySo8MoxhXbDAbuaikE_pEWsUqoX7pdCgrAgjYLfILTJfxKRdkamp2dPK2q4NzeqZKT81LNjEQG6mxE9jt6OsqhyytZ7t2cU3vrmIL_o88xTpzQniXGfVqjl_S-t5hXcyQs9vVZH2CDlkQhyIZ1nt5YPkDXt91hujwDBO3HHqVraRGn2MfJ299MnDal6nYw3RjVitPH-TiJHacgJndV5nEYfjMCyoSuAm4ouqQfla06JPMoLQAI_hjxDLsu5S78AXX8gEkV3lLXR5UUPuxKVayg90o8_PEhMMQAZR-JbIBiV3yEpi3PN-0TH1S5izLb52MdV9zMs');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1ZDExYjE3NTRlM2Q1YTVkODI0MjRmZDFiNmEyNjQ0ZWU4Y2NmYjk2NmIyNTU1Mjg3ZDkyOWY0MzQxODEwYjY2ZTJmNjAzMzMxMzYzNDQ0In0.eyJhdWQiOiIxIiwianRpIjoiNjVkMTFiMTc1NGUzZDVhNWQ4MjQyNGZkMWI2YTI2NDRlZThjY2ZiOTY2YjI1NTUyODdkOTI5ZjQzNDE4MTBiNjZlMmY2MDMzMzEzNjM0NDQiLCJpYXQiOjE1MzQ3NDQ5MjUsIm5iZiI6MTUzNDc0NDkyNSwiZXhwIjoxNTM0ODMxMzI1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.Ljfs-buhGpl3_DIpweYywTDtIg4NajFbdMZiNCaiQbnEXiThFwEb3iDxFg0zO5QttdafI1Nzkd00GRgHgPE_cra4PkJC0YFj7No8ezhSj3FuzlR4nlGntFy1ZJgOMBmCryOPFs-JQ0ob92Tg_DBclAKyfOEwMtib15KOqb1g9BsLz2qFi40VafE7v1zxmxRd54vnGxUZb-7w5fNaPn8smN99e6-LFdXU460SyViQjhrFR29yatDOfFpe-9PifmMC-AIctGKRawFFbXDBsDxBU3oCBFAiWHzOl-v9o-ZdLKNtUv5RCOagaUdXYR2gTpn04cM6q8TFbAOa-pU78tB3ExZPvioo3uVfF0rZySo8MoxhXbDAbuaikE_pEWsUqoX7pdCgrAgjYLfILTJfxKRdkamp2dPK2q4NzeqZKT81LNjEQG6mxE9jt6OsqhyytZ7t2cU3vrmIL_o88xTpzQniXGfVqjl_S-t5hXcyQs9vVZH2CDlkQhyIZ1nt5YPkDXt91hujwDBO3HHqVraRGn2MfJ299MnDal6nYw3RjVitPH-TiJHacgJndV5nEYfjMCyoSuAm4ouqQfla06JPMoLQAI_hjxDLsu5S78AXX8gEkV3lLXR5UUPuxKVayg90o8_PEhMMQAZR-JbIBiV3yEpi3PN-0TH1S5izLb52MdV9zMs');
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers
            })
        );
    }
}
