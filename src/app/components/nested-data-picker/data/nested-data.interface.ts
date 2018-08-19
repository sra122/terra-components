import { Observable } from 'rxjs/Observable';
import { TerraPagerInterface } from '../../../..';
import { NestedDetailDataInterface } from './nested-detail-data.interface';

/**
 * @author chirila-ioan-daniel
 */
export interface NestedDataInterface<T>
{
    id?:number;
    name?:string;
    label?:string;
    key?:string;
    isSelected?:boolean;
    children?:Array<NestedDataInterface<T>>;
    hasChildren?:boolean;
    parentId?:number;
    onLazyLoad?:() => Observable<any>;
    selectable?:boolean;
    isLastPage?:number;
    details?:Array<NestedDetailDataInterface>;
    data?:T;
}
