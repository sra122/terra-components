import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isNullOrUndefined } from 'util';
import { Observer } from 'rxjs';
import { TerraNestedDataPickerBaseService } from '../components/nested-data-picker/service/terra-nested-data-picker-base.service';
import { NestedPagerDataInterface } from '../components/nested-data-picker/data/nested-pager-data.interface';
import { NestedDataInterface } from '../components/nested-data-picker/data/nested-data.interface';
@Injectable()
export class NestedPickerService extends TerraNestedDataPickerBaseService<{}>
{
    // public results:Array<Object> = [
    //         {
    //             Parent:{
    //                 child1:{
    //                     fieldName:'age',
    //                     fieldType:'int',
    //                     fieldValuesMapKey:'',
    //                     groupFieldLabel:'Parent',
    //                     label:'Age rating'
    //                 },
    //                 child2:{
    //                     fieldName:'name',
    //                     fieldType:'string',
    //                     fieldValuesMapKey:'',
    //                     groupFieldLabel:'Parent',
    //                     label:'Name'
    //                 }
    //             },
    //         },
    //         {
    //             Parent2:{
    //                 child3:{
    //                     fieldName:'ean',
    //                     fieldType:'float',
    //                     fieldValuesMapKey:'',
    //                     groupFieldLabel:'Parent2',
    //                     label:'EAN'
    //                 },
    //                 child4:{
    //                     fieldName:'tall',
    //                     fieldType:'boolean',
    //                     fieldValuesMapKey:'',
    //                     groupFieldLabel:'Parent2',
    //                     label:'Tall'
    //                 }
    //             }
    //         }
    //     ];
    public parents:NestedPagerDataInterface = {
        entries:[
            {
                id:1,
                hasChildren: true,
                details:[
                    {
                        detailId:1,
                        name:'Parent 1'
                    }
                ]
            },
            {
                id:2,
                hasChildren: true,
                details:[
                    {
                        detailId:2,
                        name:'Parent 2'
                    }
                ]
            },
            {
                id:3,
                hasChildren: true,
                details:[
                    {
                        detailId:3,
                        name:'Parent 3'
                    }
                ]
            },
            {
                id:4,
                hasChildren: true,
                details:[
                    {
                        detailId:4,
                        name:'Parent 4'
                    }
                ]
            }
        ],
        firstOnPage:1,
        isLastPage:true,
        itemsPerPage:50,
        lastOnPage:3,
        lastPageNumber:1,
        page:1,
        totalsCount:3
    };

    public childs:NestedPagerDataInterface = {
        entries:[
            {
                id:1,
                parentId: 1,
                details:[
                    {
                        detailId:1,
                        name:'Child 1'
                    }
                ]
            },
            {
                id:2,
                parentId: 1,
                details:[
                    {
                        detailId:1,
                        name:'Child 2'
                    }
                ]
            },
            {
                id:3,
                parentId: 2,
                details:[
                    {
                        detailId:2,
                        name:'Child 3'
                    }
                ]
            },
            {
                id:4,
                parentId: 3,
                details:[
                    {
                        detailId:3,
                        name:'Child 4'
                    }
                ]
            },
            {
                id:5,
                parentId: 4,
                details:[
                    {
                        detailId:4,
                        name:'Child 5'
                    }
                ]
            }
        ],
        firstOnPage:1,
        isLastPage:true,
        itemsPerPage:50,
        lastOnPage:3,
        lastPageNumber:1,
        page:1,
        totalsCount:3
    };
    public requestNestedData(parentId:string | number):Observable<NestedPagerDataInterface>
    {
        let data:NestedPagerDataInterface;
        console.error('Se apeleaza');
        console.error(parentId);
        if(!isNullOrUndefined(parentId))
        {
            data = {
                entries:[],
                firstOnPage:1,
                isLastPage:true,
                itemsPerPage:50,
                lastOnPage:3,
                lastPageNumber:1,
                page:1,
                totalsCount:3
            };
            this.childs.entries.forEach((child:NestedDataInterface<{}>) =>
            {
                if(child.parentId === parentId)
                {
                    data.entries.push(child);
                }
            });
        }
        else
        {
            data = this.parents;
        }
        return Observable.create((observer:Observer<NestedPagerDataInterface>) =>
        {
            observer.next(data);
            observer.complete();
        });
    }

    public requestNestedDataById(id:number):Observable<NestedPagerDataInterface>
    {
        console.warn(id);
        let childs:NestedPagerDataInterface;
        childs = {
            entries:[],
            firstOnPage:1,
            isLastPage:true,
            itemsPerPage:50,
            lastOnPage:3,
            lastPageNumber:1,
            page:1,
            totalsCount:3
        };
        this.childs.entries.forEach((child:NestedDataInterface<{}>) =>
        {
            if(child.parentId === id)
            {
                childs.entries.push(child);
            }
        });
        console.error(childs);
        return Observable.create((observer:Observer<NestedPagerDataInterface>) =>
        {
            observer.next(childs);
            observer.complete();
        });
    }
}
