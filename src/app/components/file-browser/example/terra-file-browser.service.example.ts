import {
    Injectable,
    NgZone
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { isNullOrUndefined } from 'util';
import { TerraBaseMetadataStorageService } from '../terra-base-metadata-storage.interface';
import { createS3StorageObject } from '../model/s3-storage-object.interface';
import { TerraStorageObjectList } from '../model/terra-storage-object-list';
import { TerraImageMetadata } from '../model/terra-image-metadata.interface';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TerraUploadQueue } from '../model/terra-upload-queue';
import { TerraLoadingSpinnerService } from '../../loading-spinner/service/terra-loading-spinner.service';
import { TerraUploadItem } from '../model/terra-upload-item';
import { TranslationService } from 'angular-l10n';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TerraFileBrowserServiceExample extends TerraBaseMetadataStorageService
{
    public isImagePreviewEnabled:boolean = true;

    public name:string;

    public queue:TerraUploadQueue = new TerraUploadQueue('/rest/storage/frontend/file');

    private storageInitialized:boolean = false;

    private storageListSubject:BehaviorSubject<TerraStorageObjectList> = new BehaviorSubject(null);

    private get _storageList():TerraStorageObjectList
    {
        return this.storageListSubject.getValue();
    }

    public get uploadProgress():Observable<number>
    {
        return this.queue.progress;
    }

    private metadataCache:{ [storageKey:string]:TerraImageMetadata } = {};

    constructor(terraLoadingSpinnerService:TerraLoadingSpinnerService, http:Http, translation:TranslationService)
    {
        super(terraLoadingSpinnerService, http, '/rest/storage/frontend/file');
        this.name = translation.translate('terraFileBrowser.myFiles');
    }

    public getStorageList():Observable<TerraStorageObjectList>
    {
        if(!this.storageInitialized)
        {
            this.initStorageList();
        }

        return this.storageListSubject;
    }

    public createDirectory(path:string):Observable<void>
    {
        if(path.charAt(0) === '/')
        {
            path = path.substr(1);
        }

        if(path.charAt(path.length - 1) !== '/')
        {
            path += '/';
        }

        path = this.prepareKey(path);

        this.setAuthorization();
        let request:Observable<void> = this.mapRequest(
            this.http.post(
                this.url + '?key=' + path,
                null,
                {
                    headers: this.headers
                }
            )
        );

        request.subscribe(() =>
        {
            this.storageListSubject.next(
                this._storageList.insertObject(createS3StorageObject(path))
            );
        });

        return request;
    }

    public uploadFiles(files:FileList | Array<File>, path:string = '/'):Array<TerraUploadItem>
    {
        if(isNullOrUndefined(files) || files.length <= 0)
        {
            return [];
        }

        let uploadItems:Array<TerraUploadItem> = [];

        /* tslint:disable:prefer-for-of */
        for(let i:number = 0; i < files.length; i++)
        {
            uploadItems.push(this.uploadFile(files[i], path));
        }
        /* tslint:enable:prefer-for-of */

        return uploadItems;
    }

    private uploadFile(file:File, path:string = '/'):TerraUploadItem
    {
        if(isNullOrUndefined(file))
        {
            return TerraUploadItem.DONE;
        }

        let item:TerraUploadItem = new TerraUploadItem(file, path, this);
        item.beforeUpload(() =>
        {
            this.storageListSubject.next(
                this._storageList.insertObject(createS3StorageObject(item.pathname))
            );
        });

        item.onSuccess((response:string) =>
        {
            let s3Data:any = JSON.parse(response);
            this.storageListSubject.next(
                this._storageList.insertObject({
                    eTag:         s3Data.eTag,
                    key:          s3Data.key,
                    lastModified: (new Date()).toISOString(),
                    size:         file.size,
                    publicUrl:    s3Data.publicUrl,
                    storageClass: 'STANDARD'
                })
            );
        });

        item.onError(() =>
        {
            this._storageList.root.removeChild(item.pathname);
            this.storageListSubject.next(this._storageList);
        });

        item.onCancel(() =>
        {
            this._storageList.root.removeChild(item.pathname);
            this.storageListSubject.next(this._storageList);
        });

        this.queue.add(item);

        this.queue.startUpload();

        return item;
    }

    public getMetadata(key:string):Observable<TerraImageMetadata>
    {
        if(this.metadataCache.hasOwnProperty(key))
        {
            return Observable.from([this.metadataCache[key]]);
        }

        this.setAuthorization();
        let request:Observable<any> = this.mapRequest(
            this.http.get(
                this.url + '/metadata?key=' + key,
                {
                    headers: this.headers
                }
            )
        );

        request.subscribe((metadata:any) =>
            {
                this.metadataCache[key] = metadata;
            },
            () =>
            {
                delete this.metadataCache[key];
            }
        );

        return request;
    }

    public updateMetadata(key:string, metadata:TerraImageMetadata):Observable<any>
    {
        this.setAuthorization();
        let request:Observable<any> = this.mapRequest(
            this.http.post(
                this.url + '/metadata',
                {
                    key:      key,
                    metadata: metadata
                },
                {
                    headers: this.headers
                }
            )
        );

        request.subscribe(() =>
            {
                this.metadataCache[key] = metadata;
            },
            () =>
            {
                delete this.metadataCache[key];
            }
        );

        return request;
    }

    public deleteFiles(keyList:Array<string>):Observable<void>
    {
        this.setAuthorization();

        let request:Subject<any> = new Subject();

        // let request:Observable<any> = this.mapRequest(
        //     this.http.delete(
        //         '/rest/storage/frontend/files?' + keyList.map((key:string):string => 'keyList[]=' + key).join('&'),
        //         {
        //             headers: this.headers
        //         }
        //     )
        // );

        let source:Observable<void> = new Observable(observer => {
            observer.next();

            setTimeout(() => {
                observer.next();
            }, 1000);

            setTimeout(() => {
                observer.next();
                observer.complete();
            }, 1500);

            return {unsubscribe() {}};
        });

        keyList.forEach((key:string):void => this._storageList.root.removeChild(key));
        this.storageListSubject.next(this._storageList);

        // request.subscribe(():void =>
        //     {
        //         keyList.forEach((key:string):void => this._storageList.root.removeChild(key));
        //         this.storageListSubject.next(this._storageList);
        //     },
        //     ():void =>
        //     {
        //         this.storageInitialized = false;
        //         this.storageListSubject.next(null);
        //     }
        // );

        request.next();

        return source;
    }

    private initStorageList(continuationToken?:string):void
    {
        this.storageInitialized = true;

        let url:string = '/rest/storage/frontend/files';
        if(!isNullOrUndefined(continuationToken))
        {
            url += '?continuationToken=' + encodeURIComponent(continuationToken);
        }

        this.setAuthorization();

        let storageList:TerraStorageObjectList = new TerraStorageObjectList();
        storageList.insertObjects([
            {
            eTag: "99376ba26",
            key: "Beispielbild.jpg",
            lastModified: (new Date()).toISOString(),
            size: 0,
            publicUrl:    '',
            storageClass: "STANDARD"
            },
            {
                eTag: "312321ce26",
                key: "Beispielbild2.png",
                lastModified: (new Date()).toISOString(),
                size: 0,
                publicUrl:    '',
                storageClass: "STANDARD"
            }]);
        this.storageListSubject.next(storageList);

        // this.mapRequest(this.http.get(url, {headers: this.headers})).subscribe((results:any):void =>
        //     {
        //         let storageList:TerraStorageObjectList = this.storageListSubject.getValue() || new TerraStorageObjectList();
        //         storageList.insertObjects(results.objects);
        //         this.storageListSubject.next(storageList);
        //
        //         if(results.isTruncated && results.nextContinuationToken.length > 0)
        //         {
        //             this.initStorageList(results.nextContinuationToken);
        //         }
        //     },
        //     (err:any):void =>
        //     {
        //         console.error(err);
        //         this.storageInitialized = false;
        //         this.storageListSubject.next(null);
        //     }
        // );


    }
}
