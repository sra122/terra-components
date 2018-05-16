import {
    EventEmitter,
    Injectable,
    Injector
} from '@angular/core';
import { TerraMultiSplitViewInterface } from './terra-multi-split-view.interface';
import { isNullOrUndefined } from 'util';
import * as CircularJSON from 'circular-json';
import {
    ActivatedRouteSnapshot,
    Resolve,
    ResolveData,
    Route,
    Router,
    RouterStateSnapshot,
    Routes
} from '@angular/router';
import { TerraDynamicLoadedComponentInputInterface } from '../../../dynamic-module-loader/data/terra-dynamic-loaded-component-input.interface';
import { UrlHelper } from '../../../../helpers/url.helper';
import { TranslationService } from 'angular-l10n';
import { TerraMultiSplitViewComponent } from '../terra-multi-split-view.component';

export interface ResolvedData
{
    urlPart:string;
    resolves:TerraDynamicLoadedComponentInputInterface[];
}

export interface ResolverListItem
{
    urlPart:string;
    resolver:{
        key:string;
        service:Resolve<any>;
    };
}

@Injectable()
export class TerraMultiSplitViewConfig
{
    public currentSelectedView:TerraMultiSplitViewInterface;
    private _views:Array<TerraMultiSplitViewInterface> = [];

    private _selectBreadcrumbEventEmitter:EventEmitter<TerraMultiSplitViewInterface> = new EventEmitter<TerraMultiSplitViewInterface>();
    public deleteViewEventEmitter:EventEmitter<TerraMultiSplitViewInterface> = new EventEmitter<TerraMultiSplitViewInterface>();
    private _splitViewComponent:TerraMultiSplitViewComponent;


    public routingConfig:Routes = [];
    private _routerStateSnapshot:RouterStateSnapshot;
    private _activatedRouteSnapshot:ActivatedRouteSnapshot;

    constructor(
        private _router?:Router,
        private _injector?:Injector,
        private _translation?:TranslationService)
    {

    }

    public addView(view:TerraMultiSplitViewInterface, parent?:TerraMultiSplitViewInterface):void
    {
        if(view.parameter)
        {
            console.warn(
                'Property \'parameter\' is deprecated. It will be removed in one of the upcoming releases. Please use \'inputs\' instead.');
        }

        // TODO: setTimeout can be removed, if it is guaranteed that change detection is fired when adding a new view
        setTimeout(() =>
            {
                if(isNullOrUndefined(parent))
                {
                    if(isNullOrUndefined(this.currentSelectedView))
                    {
                        this.currentSelectedView = view;
                        this._views.push(view);
                    }
                    else
                    {
                        parent = this.currentSelectedView;
                    }
                }

                if(parent)
                {
                    view.parent = parent;

                    if(isNullOrUndefined(parent.children))
                    {
                        parent.children = [view];
                    }
                    else
                    {
                        let viewExist:boolean = false;

                        for(let child of parent.children)
                        {
                            // TODO very ugly way, maybe add an option to use an id?
                            let hasSameParameter:boolean = child.parameter && view.parameter &&
                                                           CircularJSON.stringify(child.parameter) === CircularJSON.stringify(view.parameter);
                            let hasSameInputs:boolean = child.inputs && view.inputs &&
                                                        CircularJSON.stringify(child.inputs) === CircularJSON.stringify(view.inputs);
                            let hasSameName:boolean = child.name === view.name;
                            let hasSameModule:boolean = child.module.ngModule === view.module.ngModule;

                            if(hasSameModule && (hasSameParameter || hasSameInputs || hasSameName))
                            {
                                view = child;
                                viewExist = true;
                                break;
                            }
                        }

                        if(!viewExist)
                        {
                            parent.children.push(view);
                        }
                    }
                }

                // synchronize modules array with input config
                this._splitViewComponent.addToModulesIfNotExist(view);

                // set the selected view
                this._splitViewComponent.setSelectedView(view);
            }
        );
    }

    public removeView(view:TerraMultiSplitViewInterface):void
    {
        if(isNullOrUndefined(view))
        {
            return;
        }

        // update modules array
        let viewToSelect:TerraMultiSplitViewInterface = this._splitViewComponent.removeFromModules(view);

        // select the parent view
        this._splitViewComponent.handleBreadCrumbClick(viewToSelect);

        if(this.removeViewAndChildren(view))
        {
            // notify user
            this.deleteViewEventEmitter.next(view);
        }
    }

    private removeViewAndChildren(view:TerraMultiSplitViewInterface):boolean
    {
        if(view.children && view.children.length > 0)
        {
            view.children.forEach((child:TerraMultiSplitViewInterface) => {
                this.removeViewAndChildren(child);
            });
        }

        let parent:TerraMultiSplitViewInterface = view.parent;
        let viewIndex:number = parent.children.findIndex((elem:TerraMultiSplitViewInterface) => elem === view);

        if(viewIndex >= 0)
        {
            parent.children.splice(viewIndex, 1);
            return true;
        }
        return false;
    }

    public resizeView(view:TerraMultiSplitViewInterface, width:string):void
    {
        view.defaultWidth = width;

        this._splitViewComponent.resizeViewAndModule(view);
    }

    public setSelectedView(view:TerraMultiSplitViewInterface):void
    {
        this._splitViewComponent.setSelectedView(view);
    }

    public reset():void
    {
        this._views = [];
        this.currentSelectedView = null;
        this._selectBreadcrumbEventEmitter.unsubscribe();
        this._selectBreadcrumbEventEmitter = new EventEmitter<TerraMultiSplitViewInterface>();
    }

    public navigateToViewByUrl(url:string):void
    {
        if(!this._splitViewComponent.inputHasRouting)
        {
            console.warn('Routing is deactivated. If you want to use routing for the split-view set the components input "inputHasRouting"');
            return;
        }

        // check if the needed dependencies are injected
        if(isNullOrUndefined(this._router))
        {
            console.error('_router is not defined.. Please inject the Router in your config-instance to make routing functionality available');
            return;
        }
        if(isNullOrUndefined(this._injector))
        {
            console.error('_injector is not defined. Please inject the Injector in your config-instance to make routing functionality available');
            return;
        }
        if(isNullOrUndefined(this._translation))
        {
            console.error('_translation is not defined. Please inject the TranslationService in your config-instance to make routing functionality available');
            return;
        }

        this._routerStateSnapshot = this._router.routerState.snapshot;
        this._activatedRouteSnapshot = this._routerStateSnapshot.root;

        let redirectUrl:string = this.urlIsRedirected(url);

        if(redirectUrl)
        {
            if(redirectUrl === 'invalidRoute')
            {
                this._router.navigate(['/error-page'],
                    {
                        queryParams: {
                            errorCode: 'invalidRoute',
                            errorUrl:  url
                        }
                    });
                return;
            }
            this._router.navigateByUrl(url + redirectUrl);
            return;
        }

        this.getResolveDataForUrl(url, this.routingConfig);
    }

    private addOrSelectViewsByUrl(url:string, resolveData:ResolvedData[]):void
    {
        let views:TerraMultiSplitViewInterface[] = this._views;
        let routeConfig:Routes = this.routingConfig;

        url = UrlHelper.removeLeadingSlash(url);
        let urlParts:string[] = url.split('/');

        let viewToSelect:TerraMultiSplitViewInterface;
        let partialRoute:string = '';

        urlParts.forEach((urlPart:string) =>
        {
            partialRoute += '/' + urlPart;
            let route:Route = routeConfig.find((r:Route) => r.path === urlPart || r.path.startsWith(':'));
            if(route)
            {
                if(route.data && route.data.mainComponentName)
                {
                    let view:TerraMultiSplitViewInterface = views.find(
                        (v:TerraMultiSplitViewInterface) => this.viewForRoutePartExists(v, route, urlPart)
                    );

                    if(isNullOrUndefined(view))
                    {
                        this.addView(this.createNewViewByUrlPart(route, urlPart, partialRoute, resolveData), viewToSelect);
                        viewToSelect = null;
                        console.log('View not found'); // TODO: remove when done
                    }
                    else
                    {
                        console.log(view); // TODO: remove when done
                        viewToSelect = view;
                        if(view.children && view.children.length > 0)
                        {
                            views = view.children;
                        }
                        // TODO: reset inputs with new resolve data??
                    }
                }
                if(route.children && route.children.length > 0)
                {
                    routeConfig = route.children;
                }
            }
            else
            {
                console.error('Route not found');
            }
        });

        if(viewToSelect)
        {
            this.setSelectedView(viewToSelect);
        }
    }

    private viewForRoutePartExists(view:TerraMultiSplitViewInterface, route:Route, viewId:string):boolean
    {
        return view.mainComponentName === route.data.mainComponentName && isNullOrUndefined(view.id)
               || view.mainComponentName === route.data.mainComponentName && route.path.startsWith(':') && view.id && view.id === viewId;
    }

    private createNewViewByUrlPart(route:Route, urlPart:string, partialUrl:string, resolveData:ResolvedData[]):TerraMultiSplitViewInterface
    {
        let viewName:string;
        if(typeof route.data.name === 'function')
        {
            let res:ResolvedData = resolveData.find((data:ResolvedData) => data.urlPart === urlPart);
            if(res)
            {
                let obj:ResolveData = {};
                res.resolves.forEach((resolve:TerraDynamicLoadedComponentInputInterface) => {
                    obj[resolve.name] = resolve.value;
                });
                viewName = this._translation.translate(route.data.name(obj), {id: urlPart});
            }
        }
        else
        {
            viewName = this._translation.translate(route.data.name, {id: urlPart});
        }
        let newView:TerraMultiSplitViewInterface =
            {
                module:                route.data.module,
                name:                  viewName,
                defaultWidth:          route.data.defaultWidth,
                focusedWidth:          route.data.focusedWidth ? route.data.focusedWidth : undefined,
                mainComponentName:     route.data.mainComponentName,
                id:                    route.path.startsWith(':') ? urlPart : undefined,
                url:                   partialUrl
            };
        if(route.resolve)
        {
            let res:ResolvedData = resolveData.find((data:ResolvedData) => data.urlPart === urlPart);
            if(res)
            {
                newView.inputs = res.resolves;
            }
        }
        return newView;
    }

    private urlIsRedirected(url:string):string
    {
        let routeConfig:Routes = this.routingConfig;
        let views:TerraMultiSplitViewInterface[] = this._views;
        url = UrlHelper.removeLeadingSlash(url);
        let urlParts:string[] = url.split('/');
        let route:Route;
        let isInvalidRoute:boolean = false;
        let view:TerraMultiSplitViewInterface;
        urlParts.forEach((urlPart:string) =>
        {
            route = routeConfig.find((r:Route) => r.path === urlPart || r.path.startsWith(':'));
            if(route)
            {
                if(route.data && route.data.mainComponentName)
                {
                    view = views.find(
                        (v:TerraMultiSplitViewInterface) => this.viewForRoutePartExists(v, route, urlPart)
                    );

                    if(view)
                    {
                        if(view.children && view.children.length > 0)
                        {
                            views = view.children;
                        }
                    }
                }

                if(route.children && route.children.length > 0)
                {
                    routeConfig = route.children;
                }
                else
                {
                    routeConfig = [];
                }
            }
            else
            {
                isInvalidRoute = true;
                return;
            }
        });
        if(isInvalidRoute)
        {
            return 'invalidRoute';
        }
        if(!view) // do not redirect if the view is already added
        {
            let rou:Route = routeConfig.find((r:Route) => r.path === '' && !isNullOrUndefined(r.redirectTo));
            if(rou)
            {
                return '/' + rou.redirectTo;
            }
        }
        return null;
    }

    private getResolveDataForUrl(url:string, routeConfig:Routes):void
    {
        let resolverList:ResolverListItem[] = this.getResolversForUrl(url, routeConfig);
        let data:ResolvedData[];

        this.resolveInSequence(url, resolverList, data);
    }

    private getResolversForUrl(url:string, routeConfig:Routes):ResolverListItem[]
    {
        url = UrlHelper.removeLeadingSlash(url);
        let urlParts:string[] = url.split('/');

        let resolverList:ResolverListItem[] = [];
        urlParts.forEach((urlPart:string) =>
        {
            let route:Route = routeConfig.find((r:Route) => r.path === urlPart || r.path.startsWith(':'));
            if(route)
            {
                if(route.resolve)
                {
                    for(let elem in route.resolve)
                    {
                        let resolver:ResolverListItem = {
                            urlPart: urlPart,
                            resolver: {
                                key:     elem,
                                service: this._injector.get(route.resolve[elem])
                            }
                        };

                        if(isNullOrUndefined(resolverList))
                        {
                            resolverList = [resolver];
                        }
                        else
                        {
                            resolverList.push(resolver);
                        }
                    }
                }

                if(route.children && route.children.length > 0)
                {
                    routeConfig = route.children;
                }
            }
        });

        return resolverList;
    }

    private resolveInSequence(url:string, resolverList:ResolverListItem[], data:ResolvedData[]):void
    {
        if(isNullOrUndefined(resolverList) || resolverList.length === 0)
        {
            // all data resolved go to view addition/selection
            console.log('done'); // TODO remove when development is finished
            this.addOrSelectViewsByUrl(url, data);
            return;
        }

        let resolverListItem:ResolverListItem = resolverList.shift();
        resolverListItem.resolver.service.resolve(this._activatedRouteSnapshot, this._routerStateSnapshot).subscribe((res:any) =>
        {
            let resolveData:TerraDynamicLoadedComponentInputInterface = {
                name:  resolverListItem.resolver.key,
                value: res
            };

            if(isNullOrUndefined(data))
            {
                data = [{
                    urlPart:  resolverListItem.urlPart,
                    resolves: [resolveData]
                }];
            }
            else
            {
                let obj = data.find((dat) => dat.urlPart === resolverListItem.urlPart);
                if(obj)
                {
                    if(isNullOrUndefined(obj.resolves))
                    {
                        obj.resolves = [resolveData];
                    }
                    else
                    {
                        obj.resolves.push(resolveData);
                    }
                }
                else
                {
                    data.push({
                        urlPart:  resolverListItem.urlPart,
                        resolves: [resolveData]
                    });
                }
            }

            // go to the next resolver
            this.resolveInSequence(url, resolverList, data);
        });
    }

    public get selectBreadcrumbEventEmitter():EventEmitter<TerraMultiSplitViewInterface>
    {
        return this._selectBreadcrumbEventEmitter;
    }

    public set splitViewComponent(value:TerraMultiSplitViewComponent)
    {
        this._splitViewComponent = value;
    }

}
