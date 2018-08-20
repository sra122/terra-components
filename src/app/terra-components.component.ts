import {
    Component,
    ViewContainerRef
} from '@angular/core';
import { NestedPickerService } from './service/nested-picker.service';
import { CategoryPickerService } from './service/category-picker.service';
import { TerraBaseService, TerraDynamicFormService } from '..';

@Component({
    selector: 'terra-app-root',
    template: require('./terra-components.component.html'),
    styles:   [require('./terra-components.component.scss')]
})
export class TerraComponentsComponent
{
    private _viewContainerRef:ViewContainerRef;
    private _terraPicker:NestedPickerService = new NestedPickerService();
    private _terraCategoryPicker:CategoryPickerService = new CategoryPickerService(this.terraService);
    constructor(private viewContainerRef:ViewContainerRef,
                private terraService:TerraDynamicFormService)
    {
        // You need this small hack in order to catch application root view container ref
        this._viewContainerRef = viewContainerRef;
    }
}
