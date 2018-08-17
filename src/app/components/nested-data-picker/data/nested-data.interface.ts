import { Observable } from 'rxjs/Observable';
import { TerraPagerInterface } from '../../../..';

/**
 * @author chirila-ioan-daniel
 */
export interface NestedDataInterface<T>
{
    id?:number;
    label?:string;
    key?:string;
    isSelected?:boolean;
    children?:Array<NestedDataInterface<T>>;
    hasChildren?:boolean;
    parentId?:number;
    onLazyLoad?:() => Observable<any>;
    selectable?:boolean;
    isLastPage?:number;
    data?:T;
}
