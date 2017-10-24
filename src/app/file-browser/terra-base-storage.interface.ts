import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TerraStorageObjectList } from './model/terra-storage-object-list';
import { TerraBaseService } from '../service/terra-base.service';
import { Observable } from 'rxjs/Observable';
import { TerraUploadItem } from './model/terra-upload-item';

export abstract class TerraBaseStorageService extends TerraBaseService
{
    public abstract getStorageList(): BehaviorSubject<TerraStorageObjectList>;

    public abstract createDirectory( path: string ): Observable<any>;

    public abstract uploadFile( file: File, path: string ): TerraUploadItem;

    public abstract uploadFiles( files: FileList | File[], path: string ): TerraUploadItem[];

    public abstract deleteFiles( keys: string[] ): Observable<any>;

    public prepareKey(value:string, isName:boolean = false):string
    {
        value = value
            .replace(/\s+/g, '_')                 // Replace whitespaces
            .replace(/ä/g, 'ae')                  // Replace special characters
            .replace(/ö/g, 'oe')
            .replace(/ü/g, 'ue')
            .replace(/Ä/g, 'Ae')
            .replace(/Ö/g, 'Oe')
            .replace(/Ü/g, 'Ue')
            .replace(/ß/g, 'ss')
            .replace(/[^A-Za-z0-9\-_\/.]/g, '');     // Remove all remaining special characters

        if(isName)
        {
            // remove slashes in names to avoid creating subdirectories
            value = value.replace(/\//g, '');
        }

        return value;
    }
}