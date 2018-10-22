import {
    Component
} from '@angular/core';
import { TerraBaseStorageService } from '../terra-base-storage.interface';
import { TerraFileBrowserServiceExample } from './terra-file-browser.service.example';
import { TerraLoadingSpinnerService } from '../../../..';

@Component({
    selector: 'terra-file-browser-example',
    styles:   [require('./terra-file-browser.component.example.scss')],
    providers: [TerraFileBrowserServiceExample],
    template: require('./terra-file-browser.component.example.html'),
})
export class TerraFileBrowserComponentExample
{
    storageServices:Array<TerraBaseStorageService> = [];

    constructor(storageService:TerraFileBrowserServiceExample)
    {
        this.storageServices.push(storageService)
    }
}
