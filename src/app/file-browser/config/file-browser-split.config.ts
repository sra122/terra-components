import { Injectable } from '@angular/core';
import { TerraImagePreviewModule } from '../image-preview/image-preview.module';
import { TerraFileListModule } from '../file-list/file-list.module';
import { TerraMultiSplitViewConfig } from '../../split-view/multi/data/terra-multi-split-view.config';
import { TerraMultiSplitViewInterface } from '../../split-view/multi/data/terra-multi-split-view.interface';
import { TerraStorageObject } from '../model/terra-storage-object';
import { TerraBaseStorageService } from '../terra-base-storage.interface';

const SPLIT_WIDTH_FULL = 'col-xs-12 col-md-12 col-lg-12';
const SPLIT_WIDTH_CONTENT = 'col-xs-12 col-md-9 col-lg-10';
const SPLIT_WIDTH_SIDEBAR = 'col-xs-12 col-md-3 col-lg-2';

const FILE_LIST_INPUTS      = {
    inputStorageServices: 'inputStorageServices'
};

const IMAGE_PREVIEW_INPUTS  = {
    inputStorageService: 'inputStorageService',
    inputStorageObject: 'inputStorageObject'
};

const IMAGE_EDITOR_INPUTS   = {
    inputImageUrl: 'inputImageUrl'
};

@Injectable()
export class FileBrowserSplitConfig extends TerraMultiSplitViewConfig
{
    private _fileListView: TerraMultiSplitViewInterface;
    private _imagePreviewView: TerraMultiSplitViewInterface;
    private _imageEditorView: TerraMultiSplitViewInterface;
    private _storageServices: Array<TerraBaseStorageService>;

    public init(storageServices:Array<TerraBaseStorageService>):void
    {
        this._storageServices = storageServices;

        this._fileListView = {
            module:            TerraFileListModule.forRoot(),
            defaultWidth:      SPLIT_WIDTH_CONTENT,
            focusedWidth:      SPLIT_WIDTH_FULL,
            name:              'File List',
            mainComponentName: TerraFileListModule.getMainComponent(),
            inputs:            [
                {
                    name: FILE_LIST_INPUTS.inputStorageServices,
                    value: this._storageServices
                }
            ]
        };
        this.addView(this._fileListView);

        this._imagePreviewView = {
            module:            TerraImagePreviewModule.forRoot(),
            defaultWidth:      '',
            focusedWidth:      SPLIT_WIDTH_SIDEBAR,
            name:              'Image Preview',
            mainComponentName: TerraImagePreviewModule.getMainComponent(),
            inputs:            [
                {
                    name: IMAGE_PREVIEW_INPUTS.inputStorageObject,
                    value: null
                },
                {
                    name: IMAGE_PREVIEW_INPUTS.inputStorageService,
                    value: null
                }
            ]
        };
        this.addView(this._imagePreviewView, this._fileListView);

        setTimeout((() =>
        {
            this.setSelectedView(this._fileListView);
        }).bind(this));

    }

    public showImagePreview(storageObject:TerraStorageObject, storageService:TerraBaseStorageService):void
    {
        this._imagePreviewView.inputs = [
            {
                // IMPORTANT: need to assign inputStorageService before inputStorageObject because setting inputStorageObject will receive metadata from inputStorageService.
                name: IMAGE_PREVIEW_INPUTS.inputStorageService,
                value: storageService
            },
            {
                name: IMAGE_PREVIEW_INPUTS.inputStorageObject,
                value: storageObject
            }
        ];
        this.setSelectedView(this._imagePreviewView);
    }

    public hideImagePreview():void
    {
        this.setSelectedView(this._fileListView);
    }
}
