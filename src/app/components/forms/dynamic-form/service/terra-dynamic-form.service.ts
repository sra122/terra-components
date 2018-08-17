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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJhMDRmMzgzYmJjMTBkYzI0MjQwMDE0NzczOTg4YmZmZjAzMWEzZmUxNGY1ZmM4NDQ3ZTU0YTBmOGZhNDI0NmFlMjY5NDVhM2I1OTc3ZGUyIn0.eyJhdWQiOiIxIiwianRpIjoiYmEwNGYzODNiYmMxMGRjMjQyNDAwMTQ3NzM5ODhiZmZmMDMxYTNmZTE0ZjVmYzg0NDdlNTRhMGY4ZmE0MjQ2YWUyNjk0NWEzYjU5NzdkZTIiLCJpYXQiOjE1MzQ0OTI5MjEsIm5iZiI6MTUzNDQ5MjkyMSwiZXhwIjoxNTM0NTc5MzIxLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.mrDkUu3wi69tGvOh0HK57aVBx6qydloOEvMrvJxhLdlJvHk73-wmymrblAK3G6si67WnjUq13jhXcyTjxV3ozd51VoH94pKzRxDt9WoIVpGRCVBRsbBKNvj7jjmmOCvN0kxCMNJPwD3SwjUTjgV5I67RXkC1GlmpI6XoGS7Uez-dNbyj9MbwBEY-0IAN9emoHNg8gIvXDrDBgzZVwsl8BTHddJ612xMSFCd3ZTr08LWe5W9ikQe5o2ilnZVoX0fpOQz-GWxt_4A2ohGJYXBOUshJ5-QKbpKHcl9ByYtg7k9-N1GPA1QB2K5os3RLeXp7HptVXm-btcd6Ih82zmhLQzN3YXFcBkkSqRHhT7C9VNUKizimmxVTxZMZ6koQM7iUQXPbR6jE82hZnIxVbZb15WsEcOK4J-a8yJlwYgkWKx7vNyHyGgZiSU71-__cCPkmJAnGHlUbfTXR_S3pLMB-h50a_NzupPyg41ylDhCS9rRGyojzoMgQzdJExNCK5dURgEjkPP1iNsUrVvGhd0T3CIeKg4nRDTTOaOnOPoverYs8RMoKz5jDmVBx0HH1QD0vZZLcL8HbCl_src-3EV1Ll3ncmfQWLS_CldV-P8JnAzFtJHFkgf7c_Ac4oghsPPRvYYwTYl8piO7JRHKvU0u46-VAc9W3-BBu3fA238pW3t0');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJhMDRmMzgzYmJjMTBkYzI0MjQwMDE0NzczOTg4YmZmZjAzMWEzZmUxNGY1ZmM4NDQ3ZTU0YTBmOGZhNDI0NmFlMjY5NDVhM2I1OTc3ZGUyIn0.eyJhdWQiOiIxIiwianRpIjoiYmEwNGYzODNiYmMxMGRjMjQyNDAwMTQ3NzM5ODhiZmZmMDMxYTNmZTE0ZjVmYzg0NDdlNTRhMGY4ZmE0MjQ2YWUyNjk0NWEzYjU5NzdkZTIiLCJpYXQiOjE1MzQ0OTI5MjEsIm5iZiI6MTUzNDQ5MjkyMSwiZXhwIjoxNTM0NTc5MzIxLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.mrDkUu3wi69tGvOh0HK57aVBx6qydloOEvMrvJxhLdlJvHk73-wmymrblAK3G6si67WnjUq13jhXcyTjxV3ozd51VoH94pKzRxDt9WoIVpGRCVBRsbBKNvj7jjmmOCvN0kxCMNJPwD3SwjUTjgV5I67RXkC1GlmpI6XoGS7Uez-dNbyj9MbwBEY-0IAN9emoHNg8gIvXDrDBgzZVwsl8BTHddJ612xMSFCd3ZTr08LWe5W9ikQe5o2ilnZVoX0fpOQz-GWxt_4A2ohGJYXBOUshJ5-QKbpKHcl9ByYtg7k9-N1GPA1QB2K5os3RLeXp7HptVXm-btcd6Ih82zmhLQzN3YXFcBkkSqRHhT7C9VNUKizimmxVTxZMZ6koQM7iUQXPbR6jE82hZnIxVbZb15WsEcOK4J-a8yJlwYgkWKx7vNyHyGgZiSU71-__cCPkmJAnGHlUbfTXR_S3pLMB-h50a_NzupPyg41ylDhCS9rRGyojzoMgQzdJExNCK5dURgEjkPP1iNsUrVvGhd0T3CIeKg4nRDTTOaOnOPoverYs8RMoKz5jDmVBx0HH1QD0vZZLcL8HbCl_src-3EV1Ll3ncmfQWLS_CldV-P8JnAzFtJHFkgf7c_Ac4oghsPPRvYYwTYl8piO7JRHKvU0u46-VAc9W3-BBu3fA238pW3t0');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJhMDRmMzgzYmJjMTBkYzI0MjQwMDE0NzczOTg4YmZmZjAzMWEzZmUxNGY1ZmM4NDQ3ZTU0YTBmOGZhNDI0NmFlMjY5NDVhM2I1OTc3ZGUyIn0.eyJhdWQiOiIxIiwianRpIjoiYmEwNGYzODNiYmMxMGRjMjQyNDAwMTQ3NzM5ODhiZmZmMDMxYTNmZTE0ZjVmYzg0NDdlNTRhMGY4ZmE0MjQ2YWUyNjk0NWEzYjU5NzdkZTIiLCJpYXQiOjE1MzQ0OTI5MjEsIm5iZiI6MTUzNDQ5MjkyMSwiZXhwIjoxNTM0NTc5MzIxLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.mrDkUu3wi69tGvOh0HK57aVBx6qydloOEvMrvJxhLdlJvHk73-wmymrblAK3G6si67WnjUq13jhXcyTjxV3ozd51VoH94pKzRxDt9WoIVpGRCVBRsbBKNvj7jjmmOCvN0kxCMNJPwD3SwjUTjgV5I67RXkC1GlmpI6XoGS7Uez-dNbyj9MbwBEY-0IAN9emoHNg8gIvXDrDBgzZVwsl8BTHddJ612xMSFCd3ZTr08LWe5W9ikQe5o2ilnZVoX0fpOQz-GWxt_4A2ohGJYXBOUshJ5-QKbpKHcl9ByYtg7k9-N1GPA1QB2K5os3RLeXp7HptVXm-btcd6Ih82zmhLQzN3YXFcBkkSqRHhT7C9VNUKizimmxVTxZMZ6koQM7iUQXPbR6jE82hZnIxVbZb15WsEcOK4J-a8yJlwYgkWKx7vNyHyGgZiSU71-__cCPkmJAnGHlUbfTXR_S3pLMB-h50a_NzupPyg41ylDhCS9rRGyojzoMgQzdJExNCK5dURgEjkPP1iNsUrVvGhd0T3CIeKg4nRDTTOaOnOPoverYs8RMoKz5jDmVBx0HH1QD0vZZLcL8HbCl_src-3EV1Ll3ncmfQWLS_CldV-P8JnAzFtJHFkgf7c_Ac4oghsPPRvYYwTYl8piO7JRHKvU0u46-VAc9W3-BBu3fA238pW3t0');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJhMDRmMzgzYmJjMTBkYzI0MjQwMDE0NzczOTg4YmZmZjAzMWEzZmUxNGY1ZmM4NDQ3ZTU0YTBmOGZhNDI0NmFlMjY5NDVhM2I1OTc3ZGUyIn0.eyJhdWQiOiIxIiwianRpIjoiYmEwNGYzODNiYmMxMGRjMjQyNDAwMTQ3NzM5ODhiZmZmMDMxYTNmZTE0ZjVmYzg0NDdlNTRhMGY4ZmE0MjQ2YWUyNjk0NWEzYjU5NzdkZTIiLCJpYXQiOjE1MzQ0OTI5MjEsIm5iZiI6MTUzNDQ5MjkyMSwiZXhwIjoxNTM0NTc5MzIxLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.mrDkUu3wi69tGvOh0HK57aVBx6qydloOEvMrvJxhLdlJvHk73-wmymrblAK3G6si67WnjUq13jhXcyTjxV3ozd51VoH94pKzRxDt9WoIVpGRCVBRsbBKNvj7jjmmOCvN0kxCMNJPwD3SwjUTjgV5I67RXkC1GlmpI6XoGS7Uez-dNbyj9MbwBEY-0IAN9emoHNg8gIvXDrDBgzZVwsl8BTHddJ612xMSFCd3ZTr08LWe5W9ikQe5o2ilnZVoX0fpOQz-GWxt_4A2ohGJYXBOUshJ5-QKbpKHcl9ByYtg7k9-N1GPA1QB2K5os3RLeXp7HptVXm-btcd6Ih82zmhLQzN3YXFcBkkSqRHhT7C9VNUKizimmxVTxZMZ6koQM7iUQXPbR6jE82hZnIxVbZb15WsEcOK4J-a8yJlwYgkWKx7vNyHyGgZiSU71-__cCPkmJAnGHlUbfTXR_S3pLMB-h50a_NzupPyg41ylDhCS9rRGyojzoMgQzdJExNCK5dURgEjkPP1iNsUrVvGhd0T3CIeKg4nRDTTOaOnOPoverYs8RMoKz5jDmVBx0HH1QD0vZZLcL8HbCl_src-3EV1Ll3ncmfQWLS_CldV-P8JnAzFtJHFkgf7c_Ac4oghsPPRvYYwTYl8piO7JRHKvU0u46-VAc9W3-BBu3fA238pW3t0');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJhMDRmMzgzYmJjMTBkYzI0MjQwMDE0NzczOTg4YmZmZjAzMWEzZmUxNGY1ZmM4NDQ3ZTU0YTBmOGZhNDI0NmFlMjY5NDVhM2I1OTc3ZGUyIn0.eyJhdWQiOiIxIiwianRpIjoiYmEwNGYzODNiYmMxMGRjMjQyNDAwMTQ3NzM5ODhiZmZmMDMxYTNmZTE0ZjVmYzg0NDdlNTRhMGY4ZmE0MjQ2YWUyNjk0NWEzYjU5NzdkZTIiLCJpYXQiOjE1MzQ0OTI5MjEsIm5iZiI6MTUzNDQ5MjkyMSwiZXhwIjoxNTM0NTc5MzIxLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.mrDkUu3wi69tGvOh0HK57aVBx6qydloOEvMrvJxhLdlJvHk73-wmymrblAK3G6si67WnjUq13jhXcyTjxV3ozd51VoH94pKzRxDt9WoIVpGRCVBRsbBKNvj7jjmmOCvN0kxCMNJPwD3SwjUTjgV5I67RXkC1GlmpI6XoGS7Uez-dNbyj9MbwBEY-0IAN9emoHNg8gIvXDrDBgzZVwsl8BTHddJ612xMSFCd3ZTr08LWe5W9ikQe5o2ilnZVoX0fpOQz-GWxt_4A2ohGJYXBOUshJ5-QKbpKHcl9ByYtg7k9-N1GPA1QB2K5os3RLeXp7HptVXm-btcd6Ih82zmhLQzN3YXFcBkkSqRHhT7C9VNUKizimmxVTxZMZ6koQM7iUQXPbR6jE82hZnIxVbZb15WsEcOK4J-a8yJlwYgkWKx7vNyHyGgZiSU71-__cCPkmJAnGHlUbfTXR_S3pLMB-h50a_NzupPyg41ylDhCS9rRGyojzoMgQzdJExNCK5dURgEjkPP1iNsUrVvGhd0T3CIeKg4nRDTTOaOnOPoverYs8RMoKz5jDmVBx0HH1QD0vZZLcL8HbCl_src-3EV1Ll3ncmfQWLS_CldV-P8JnAzFtJHFkgf7c_Ac4oghsPPRvYYwTYl8piO7JRHKvU0u46-VAc9W3-BBu3fA238pW3t0');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJhMDRmMzgzYmJjMTBkYzI0MjQwMDE0NzczOTg4YmZmZjAzMWEzZmUxNGY1ZmM4NDQ3ZTU0YTBmOGZhNDI0NmFlMjY5NDVhM2I1OTc3ZGUyIn0.eyJhdWQiOiIxIiwianRpIjoiYmEwNGYzODNiYmMxMGRjMjQyNDAwMTQ3NzM5ODhiZmZmMDMxYTNmZTE0ZjVmYzg0NDdlNTRhMGY4ZmE0MjQ2YWUyNjk0NWEzYjU5NzdkZTIiLCJpYXQiOjE1MzQ0OTI5MjEsIm5iZiI6MTUzNDQ5MjkyMSwiZXhwIjoxNTM0NTc5MzIxLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.mrDkUu3wi69tGvOh0HK57aVBx6qydloOEvMrvJxhLdlJvHk73-wmymrblAK3G6si67WnjUq13jhXcyTjxV3ozd51VoH94pKzRxDt9WoIVpGRCVBRsbBKNvj7jjmmOCvN0kxCMNJPwD3SwjUTjgV5I67RXkC1GlmpI6XoGS7Uez-dNbyj9MbwBEY-0IAN9emoHNg8gIvXDrDBgzZVwsl8BTHddJ612xMSFCd3ZTr08LWe5W9ikQe5o2ilnZVoX0fpOQz-GWxt_4A2ohGJYXBOUshJ5-QKbpKHcl9ByYtg7k9-N1GPA1QB2K5os3RLeXp7HptVXm-btcd6Ih82zmhLQzN3YXFcBkkSqRHhT7C9VNUKizimmxVTxZMZ6koQM7iUQXPbR6jE82hZnIxVbZb15WsEcOK4J-a8yJlwYgkWKx7vNyHyGgZiSU71-__cCPkmJAnGHlUbfTXR_S3pLMB-h50a_NzupPyg41ylDhCS9rRGyojzoMgQzdJExNCK5dURgEjkPP1iNsUrVvGhd0T3CIeKg4nRDTTOaOnOPoverYs8RMoKz5jDmVBx0HH1QD0vZZLcL8HbCl_src-3EV1Ll3ncmfQWLS_CldV-P8JnAzFtJHFkgf7c_Ac4oghsPPRvYYwTYl8piO7JRHKvU0u46-VAc9W3-BBu3fA238pW3t0');
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
        this.setToHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJhMDRmMzgzYmJjMTBkYzI0MjQwMDE0NzczOTg4YmZmZjAzMWEzZmUxNGY1ZmM4NDQ3ZTU0YTBmOGZhNDI0NmFlMjY5NDVhM2I1OTc3ZGUyIn0.eyJhdWQiOiIxIiwianRpIjoiYmEwNGYzODNiYmMxMGRjMjQyNDAwMTQ3NzM5ODhiZmZmMDMxYTNmZTE0ZjVmYzg0NDdlNTRhMGY4ZmE0MjQ2YWUyNjk0NWEzYjU5NzdkZTIiLCJpYXQiOjE1MzQ0OTI5MjEsIm5iZiI6MTUzNDQ5MjkyMSwiZXhwIjoxNTM0NTc5MzIxLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.mrDkUu3wi69tGvOh0HK57aVBx6qydloOEvMrvJxhLdlJvHk73-wmymrblAK3G6si67WnjUq13jhXcyTjxV3ozd51VoH94pKzRxDt9WoIVpGRCVBRsbBKNvj7jjmmOCvN0kxCMNJPwD3SwjUTjgV5I67RXkC1GlmpI6XoGS7Uez-dNbyj9MbwBEY-0IAN9emoHNg8gIvXDrDBgzZVwsl8BTHddJ612xMSFCd3ZTr08LWe5W9ikQe5o2ilnZVoX0fpOQz-GWxt_4A2ohGJYXBOUshJ5-QKbpKHcl9ByYtg7k9-N1GPA1QB2K5os3RLeXp7HptVXm-btcd6Ih82zmhLQzN3YXFcBkkSqRHhT7C9VNUKizimmxVTxZMZ6koQM7iUQXPbR6jE82hZnIxVbZb15WsEcOK4J-a8yJlwYgkWKx7vNyHyGgZiSU71-__cCPkmJAnGHlUbfTXR_S3pLMB-h50a_NzupPyg41ylDhCS9rRGyojzoMgQzdJExNCK5dURgEjkPP1iNsUrVvGhd0T3CIeKg4nRDTTOaOnOPoverYs8RMoKz5jDmVBx0HH1QD0vZZLcL8HbCl_src-3EV1Ll3ncmfQWLS_CldV-P8JnAzFtJHFkgf7c_Ac4oghsPPRvYYwTYl8piO7JRHKvU0u46-VAc9W3-BBu3fA238pW3t0');
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers
            })
        );
    }
}
