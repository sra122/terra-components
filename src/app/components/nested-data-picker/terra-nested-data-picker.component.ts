import {
    AfterContentChecked,
    Component,
    forwardRef,
    Input,
    OnInit
} from '@angular/core';
import { TranslationService } from 'angular-l10n';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NestedDataTreeConfig } from './config/nested-data-tree.config';
import { NestedDataInterface } from './data/nested-data.interface';
import { TerraNodeInterface } from '../tree/node-tree/data/terra-node.interface';
import { isNullOrUndefined } from 'util';
import { NestedValueInterface } from './data/nested-value.interface';
import { TerraNestedDataPickerBaseService } from './service/terra-nested-data-picker-base.service';
import { TerraNodeTreeConfig } from '../../components/tree/node-tree/data/terra-node-tree.config';
import { Observable } from 'rxjs/Observable';

@Component({
    selector:  'terra-nested-data-picker',
    template:  require('./terra-nested-data-picker.component.html'),
    styles:    [require('./terra-nested-data-picker.component.scss')],
    providers: [
        {
            provide:     NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TerraNestedDataPickerComponent),
            multi:       true
        },
        NestedDataTreeConfig,
        TerraNodeTreeConfig
    ]
})
export class TerraNestedDataPickerComponent implements OnInit, AfterContentChecked
{
    /**
     * @description Service, that is used to request the nested data from the server
     */
    @Input()
    public inputNestedService:TerraNestedDataPickerBaseService<{}>;
    // public set inputNestedService(service:TerraNestedDataPickerBaseService<{}>)
    // {
    //     this.inputDataService = service;
    //     if(!isNullOrUndefined(service))
    //     {
    //         this.getNestedData();
    //     }
    // }

    @Input()
    public inputIsDisabled:boolean;

    /**
     * @description Tooltip that is shown on the TextInput
     */
    @Input()
    public inputTooltipText:string;

    @Input()
    public inputName:string;

    @Input()
    public displayResetButton:boolean = false;
    @Input()
    public displaySearch:boolean = false;

    public toggleTree:boolean = false;
    public isNotInitialCall:boolean;
    public value:number | string;
    private inputDataService:TerraNestedDataPickerBaseService<{}>;
    private completeNestedData:NestedValueInterface;
    private nestedDataName:string;
    private nestedList:Array<TerraNodeInterface<NestedDataInterface<{}>>>;

    constructor(public translation:TranslationService,
                public nestedTreeConfig:TerraNodeTreeConfig<{}>)
    {
        this.value = null;
        this.completeNestedData = {
            id:               null,
            isActive:         null,
            isOpen:           null,
            isVisible:        null,
            name:             '',
            tooltip:          '',
            tooltipPlacement: '',
        };
        this.nestedList = [];
        this.nestedDataName = '';
        this.isNotInitialCall = false;
    }

    public ngAfterContentChecked():void
    {
        if(this.nestedTreeConfig.list.length === 0)
        {
            this.nestedTreeConfig.list = this.nestedList;
        }
    }

    public ngOnInit():void
    {
        if(isNullOrUndefined(this.inputName))
        {
            this.inputName = this.translation.translate('terraNestedDataPicker.nested');
        }
        this.nestedTreeConfig.list = this.nestedList;
        this.getNestedDataByParent(null);
    }

    // From ControlValueAccessor interface
    public writeValue(value:string | number):void
    {
        if(!isNullOrUndefined(value))
        {
            let nodeToSelect:TerraNodeInterface<NestedDataInterface<{}>> = this.nestedTreeConfig.findNodeById(value);

            if(!isNullOrUndefined(nodeToSelect))
            {
                this.nestedTreeConfig.currentSelectedNode = nodeToSelect;
                this.nestedDataName = this.nestedTreeConfig.currentSelectedNode.name;
                value = nodeToSelect.value ? nodeToSelect.value.key : nodeToSelect.id;
            }

            this.value = value;

            if(this.isNotInitialCall)
            {
                this.updateCompleteNestedData(nodeToSelect);
                this.onTouchedCallback();
                this.onChangeCallback(this.value);
            }
        }
    }

    public onSelectNode():void
    {
        this.isNotInitialCall = true;
        if(!isNullOrUndefined(this.nestedTreeConfig.currentSelectedNode))
        {
            this.nestedDataName = this.nestedTreeConfig.currentSelectedNode.name;
            this.writeValue(this.nestedTreeConfig.currentSelectedNode.id);
        }
        this.toggleTree = !this.toggleTree;
    }

    public reset():void
    {
        this.nestedTreeConfig.currentSelectedNode = {
            id:               null,
            isActive:         null,
            isOpen:           null,
            isVisible:        null,
            name:             '',
            tooltip:          '',
            tooltipPlacement: '',
        };
        this.nestedDataName = '';
        this.value = 0;

        this.onTouchedCallback();
        this.onChangeCallback(this.value);
    }

    private updateCompleteNestedData(nested:TerraNodeInterface<NestedDataInterface<{}>>):void
    {
        this.completeNestedData.id = +nested.id;
        this.completeNestedData.isActive = nested.isActive;
        this.completeNestedData.isOpen = nested.isOpen;
        this.completeNestedData.isVisible = nested.isVisible;
        this.completeNestedData.name = nested.name;
        this.completeNestedData.tooltip = nested.tooltip;
        this.completeNestedData.tooltipPlacement = nested.tooltipPlacement;
    }

    // Set touched on blur
    public onBlur():void
    {
        this.onTouchedCallback();
    }

    // From ControlValueAccessor interface
    public registerOnChange(fn:any):void
    {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    public registerOnTouched(fn:any):void
    {
        this.onTouchedCallback = fn;
    }

    public showTree():void
    {
        this.toggleTree = !this.toggleTree;
    }

    private getNestedData(parentId:number | string):Observable<Array<NestedDataInterface<{}>>>
    {
        // this.inputDataService.requestNestedData(parentId).subscribe((data:Array<NestedDataInterface<{}>>) =>
        // {
        //     this.addNodes(data, null);
        // });
        let obs:Observable<Array<NestedDataInterface<{}>>> = this.inputNestedService.requestNestedData(parentId);

        obs.subscribe((data:Array<NestedDataInterface<{}>>) =>
        {
            this.addNodes(data, parentId);
        });

        return obs;
    }
    private getNestedDataByParent(parentNode:NestedDataInterface<{}>):void
    {
        let id:number | string = null;

        if(!isNullOrUndefined(parentNode))
        {
            id = parentNode.id;
        }

        this.inputNestedService.requestNestedData(id).subscribe((data:Array<NestedDataInterface<{}>>) =>
        {
            if(isNullOrUndefined(parentNode))
            {
                this.addNodes(data, id);
            }
            else
            {
                this.addNodes(data, parentNode.id);
            }
        });
    }
    private getNestedDataByParentId(parentId:number | string):() => Observable<Array<NestedDataInterface<{}>>>
    {
        return ():Observable<Array<NestedDataInterface<{}>>> => this.getNestedData(parentId);
    }

    public addNodes(nestedData:Array<NestedDataInterface<{}>>, parentId:number | string):void
    {

        if(this.nestedTreeConfig.list.length === 1 && this.nestedTreeConfig.list[0] === this.nestedTreeConfig.currentSelectedNode)
        {
            this.nestedTreeConfig.removeNodeById(this.nestedTreeConfig.currentSelectedNode.id);
            this.nestedTreeConfig.list = [];
        }
        console.log(nestedData);
        if(!isNullOrUndefined(nestedData))
        {
            nestedData.forEach((data:NestedDataInterface<{}>) =>
            {
                console.log(data);
                let nestData:NestedDataInterface<{}> = data;
                let nestedDetail:NestedDataInterface<{}> = null;

                // If the node hasn't already been added the routine will be started
                // if(isNullOrUndefined(this.nestedTreeConfig.findNodeById(nestData.id)))
                // {
                //     nestedDetail = nestData[0];
                //     let newParentId:string;

                //     newParentId = parentId + '-' + data.key;

                //     // Create Node to add to tree later
                //     let childNode:TerraNodeInterface<NestedDataInterface<{}>> = {
                //         id:               newParentId,
                //         name:             data.label,
                //         tooltip:          'ID: ' + data.key,
                //         value:            data,
                //         tooltipPlacement: 'top',
                //         onLazyLoad:       data.onLazyLoad,
                //         selectable:       data.selectable,
                //         isVisible:        true,
                //         onDblClick:       ():void =>
                //                         {
                //                             this.toggleTree = false;
                //                             this.nestedDataName = data.label;
                //                         }
                //     };

                //     let parentNode:TerraNodeInterface<NestedDataInterface<{}>>;

                //     // If the category has a parent, the parent node is created from the parentId in the category data
                //     if(!isNullOrUndefined(nestData.parentId))
                //     {
                //         parentNode = this.nestedTreeConfig.findNodeById(nestData.parentId);
                //     }

                //     // If the parentNode is still null it is tried to create the parent node out of the given id
                //     if(isNullOrUndefined(parentNode))
                //     {
                //         if(isNullOrUndefined(parentId))
                //         {
                //             parentNode = null;
                //         }
                //         else
                //         {
                //             parentNode = this.nestedTreeConfig.findNodeById(parentId);
                //         }
                //     }

                //     // If the category has children the lazy-loading method will be added to the parent node
                //     if(nestData.hasChildren)
                //     {
                //         childNode.onLazyLoad = this.getNestedDataByParentId(childNode.id);
                //     }

                //     // The finished node is added to the node tree
                //     this.nestedTreeConfig.addNode(childNode, parentNode);
                // }
            });
        }
        // let entries:Array<{}> = nestedData;


        // if(this.nestedTreeConfig.list.length === 1 && this.nestedTreeConfig.list[0] === this.nestedTreeConfig.currentSelectedNode)
        // {
        //     this.nestedTreeConfig.removeNodeById(this.nestedTreeConfig.currentSelectedNode.id);
        //     this.nestedTreeConfig.list = [];
        // }

        // nestedData.forEach((nested:NestedDataInterface<{}>) =>
        // {
        //     let newParentId:string;

        //     if(parentId)
        //     {
        //         newParentId = parentId + '-' + nested.key;
        //         this.nestedTreeConfig.addChildToNodeById(parentId, {
        //             id:               newParentId,
        //             name:             nested.label,
        //             tooltip:          'ID: ' + nested.key,
        //             value:            nested,
        //             tooltipPlacement: 'top',
        //             onLazyLoad:       nested.onLazyLoad,
        //             selectable:       nested.selectable,
        //             isVisible:        true,
        //             onDblClick:       ():void =>
        //                               {
        //                                   this.toggleTree = false;
        //                                   this.nestedDataName = nested.label;
        //                               }
        //         });
        //     }
        //     else
        //     {
        //         newParentId = nested.key;

        //         this.nestedTreeConfig.addNode({
        //             id:               newParentId,
        //             name:             nested.label,
        //             tooltip:          'ID: ' + nested.key,
        //             tooltipPlacement: 'top',
        //             value:            nested,
        //             selectable:       nested.selectable,
        //             onLazyLoad:       nested.onLazyLoad,
        //             isVisible:        true,
        //         });
        //     }

        //     if(!isNullOrUndefined(nested.children))
        //     {
        //         this.addNodes(nested.children, newParentId);
        //     }
        // });
    }

    // Placeholders for the callbacks which are later provided
    // by the Control Value Accessor
    public onTouchedCallback:() => void = () => undefined;

    public onChangeCallback:(_:any) => void = () => undefined;
}
