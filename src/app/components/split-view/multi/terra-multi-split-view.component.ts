import {
    Component,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit
} from '@angular/core';
import { isNullOrUndefined } from 'util';
import { TerraMultiSplitViewConfig } from './data/terra-multi-split-view.config';
import { TerraMultiSplitViewDetail } from './data/terra-multi-split-view-detail';
import { TerraMultiSplitViewInterface } from './data/terra-multi-split-view.interface';
import * as AngularRouter from '@angular/router'; // Required to use both Angular Router Events and ES6 Events
import {
    NavigationStart,
    Router,
    Routes
} from '@angular/router';

let nextSplitViewId:number = 0;

@Component({
    selector: 'terra-multi-split-view',
    template: require('./terra-multi-split-view.component.html'),
    styles:   [
        require('./terra-multi-split-view.component.scss'),
        require('./terra-multi-split-view.component.glob.scss').toString()
    ],
})
export class TerraMultiSplitViewComponent implements OnDestroy, OnInit
{
    @Input() inputConfig:TerraMultiSplitViewConfig;
    @Input() inputShowBreadcrumbs:boolean;
    @Input() inputComponentRoute:string; // to catch the routing event, when selecting the tab where the split view is instantiated

    @HostListener('window:resize')
    onWindowResize()
    {
        this.zone.runOutsideAngular(() =>
            {
                // debounce resize, wait for resize to finish before updating the viewport
                if(this.resizeTimeout)
                {
                    clearTimeout(this.resizeTimeout);
                }
                this.resizeTimeout = setTimeout((() =>
                    {
                        if(this.inputConfig.currentSelectedView)
                        {
                            this.updateViewport(this.inputConfig.currentSelectedView);
                        }
                    }
                ).bind(this), 500);
            }
        )
    };

    private _breadCrumbsPath:string;

    private modules:Array<TerraMultiSplitViewDetail> = [];

    private resizeTimeout:number;

    private splitViewId:number;

    constructor(private zone:NgZone, private _router:Router)
    {
        this.inputShowBreadcrumbs = true; // default
        this._breadCrumbsPath = '';
        this.splitViewId = nextSplitViewId++;
    }

    ngOnDestroy()
    {
        this.inputConfig.reset();
    }

    ngOnInit()
    {
        // catch routing events, but only those that select the tab where the split view is instantiated
        if(!isNullOrUndefined(this._router) && !isNullOrUndefined(this.inputComponentRoute))
        {
            // check if the given route exists in the route config
            if(this.routeExists(this.inputComponentRoute))
            {
                // register event listener
                this._router.events
                    .filter((event:AngularRouter.Event) => event instanceof NavigationStart && event.url === this.inputComponentRoute)
                    .subscribe((path:NavigationStart) =>
                    {
                        this.updateViewport(this.inputConfig.currentSelectedView);
                    });
            }
        }

        this.inputConfig.addViewEventEmitter.subscribe((value:TerraMultiSplitViewInterface) =>
        {
            // synchronize modules array with input config
            this.addToModulesIfNotExist(value);

            // set the selected view
            this.setSelectedView(value);
        });

        this.inputConfig.deleteViewEventEmitter.subscribe((value:TerraMultiSplitViewInterface) =>
        {
            // update modules array
            let viewToSelect:TerraMultiSplitViewInterface = this.removeFromModules(value);

            // select the parent view
            this.setSelectedView(viewToSelect);
        });

        this.inputConfig.resizeViewEventEmitter.subscribe((value:TerraMultiSplitViewInterface) =>
        {
            this.resizeViewAndModule(value);
        });

        this.inputConfig.setSelectedViewEventEmitter.subscribe((value:TerraMultiSplitViewInterface) =>
        {
            this.setSelectedView(value);
        });
    }

    private addToModulesIfNotExist(view:TerraMultiSplitViewInterface):void
    {
        // check whether view is null or undefined
        if(isNullOrUndefined(view))
        {
            return;
        }

        // get hierarchy level of selected view
        let hierarchyLevel:number = this.getHierarchyLevelOfView(view);

        // check if modules array is not initialized
        if(isNullOrUndefined(this.modules[hierarchyLevel]))
        {
            this.modules.push(
                {
                    views:                 [],
                    identifier:            view.mainComponentName,
                    width:                 view.focusedWidth ? view.focusedWidth : view.defaultWidth,
                    currentSelectedView:   view,
                    isBackgroundColorGrey: view.isBackgroundColorGrey
                }
            );
        }

        // get the module of the hierarchy
        let module = this.modules[hierarchyLevel];

        // initialize views array if null or undefined
        if(isNullOrUndefined(module.views))
        {
            module.views = [];
        }

        // check if view is already added to module's views array
        if(!module.views.find((elem) => elem === view))
        {
            // add view to the module's views array
            module.views.push(view);
        }
    }

    private setSelectedView(view:TerraMultiSplitViewInterface)
    {
        // check whether view is defined
        if(isNullOrUndefined(view))
        {
            return;
        }

        if(!isNullOrUndefined(this.inputConfig.selectBreadcrumbEventEmitter))
        {
            this.inputConfig.selectBreadcrumbEventEmitter.next(view);
        }

        // check whether the view's module is defined
        let module:TerraMultiSplitViewDetail = this.getModuleOfView(view);
        if(isNullOrUndefined(module))
        {
            return;
        }

        // check if view is already selected
        if(this.inputConfig.currentSelectedView === view)
        {
            // stop execution, since the view is already selected
            return;
        }

        module.isBackgroundColorGrey = view.isBackgroundColorGrey;

        // check whether the view is already opened
        if(module.currentSelectedView === view)
        {
            // also set the width of the view
            module.width = !isNullOrUndefined(view.focusedWidth) ? view.focusedWidth : view.defaultWidth;
        }
        // vertical selection has changed
        else
        {
            this.rebuildModules(view, module);
        }

        // if module has changed horizontally
        let inputModule:TerraMultiSplitViewDetail = this.getModuleOfView(this.inputConfig.currentSelectedView);
        if(inputModule !== this.getModuleOfView(view)
           && !isNullOrUndefined(inputModule)) // this has to be checked, since a module can be removed and hence isn't existing anymore
        {
            inputModule.width = this.inputConfig.currentSelectedView.defaultWidth;
        }

        this.inputConfig.currentSelectedView = view;
        this.updateViewport(view);
    }

    public updateViewport(view:TerraMultiSplitViewInterface):void
    {
        // check if view is defined
        if(isNullOrUndefined(view))
        {
            return;
        }

        this.zone.runOutsideAngular(() =>
        {
            let splitViewId:number = this.splitViewId;

            let getViewSizeById:(id:string) => number = (id:string):number =>
            {
                // TODO: @vwiebe, refactoring
                if ($(window).outerWidth() < 768) return 12;
                let className = $('#' + id).attr('class');
                let size:number = Number(className.substring(className.lastIndexOf('col-lg-') + 7, className.lastIndexOf('col-lg-') + 9).replace(' ', ''));
                return size;
            };

            setTimeout(function()
            {
                let parent:TerraMultiSplitViewInterface = view.parent;
                let moduleIndex:number = 0;

                while(!isNullOrUndefined(parent))
                {
                    parent = parent.parent;
                    moduleIndex++;
                }

                let selectedViewId:string = $('#splitview' + splitViewId + '_module' + moduleIndex).attr('id');
                let selectedViewIdIndex:number = null;
                let viewIds:string[] = [];
                let sortedViewIds:string[] = [];
                let currentViewSetSize:number = 0;
                let lastLeftViewId:string = null;
                let lastRightViewId:string = null;

                $('.side-scroller > .view').each(function(i:number)
                {
                    if($(this).attr('id') == selectedViewId)
                    {
                        selectedViewIdIndex = i;
                    }
                    viewIds.push($(this).attr('id'));
                    $(this).removeClass('show').addClass('hide');
                });

                if (!isNullOrUndefined(selectedViewIdIndex))
                {
                    sortedViewIds.push(selectedViewId);

                    // TODO: @vwiebe, refactoring
                    for (let i = 1; i < viewIds.length; i++)
                    {
                        if (viewIds[selectedViewIdIndex + i]) { sortedViewIds.push(viewIds[selectedViewIdIndex + i]); }
                        if (viewIds[selectedViewIdIndex - i]) { sortedViewIds.push(viewIds[selectedViewIdIndex - i]); }
                    }
                }

                let rightDisabled:boolean = false;
                let leftDisabled:boolean = false;
                // TODO: @vwiebe, refactoring
                for (let id of sortedViewIds)
                {
                    let currentViewSize:number = getViewSizeById(id);
                    let viewIndex:number = viewIds.indexOf(id);

                    // current view
                    if(viewIndex === selectedViewIdIndex)
                    {
                        $('#' + id).removeClass('hide').addClass('show');
                        currentViewSetSize = currentViewSetSize + currentViewSize;
                    }

                    // left of current view
                    if(viewIndex < selectedViewIdIndex)
                    {
                        if (currentViewSetSize + currentViewSize <= 12 && !leftDisabled)
                        {
                            $('#' + id).removeClass('hide').addClass('show');

                            currentViewSetSize = currentViewSetSize + currentViewSize;
                        }
                        else
                        {
                            leftDisabled = true;
                        }
                    }

                    // right of current view
                    if(viewIndex > selectedViewIdIndex)
                    {
                        if (currentViewSetSize + currentViewSize <= 12 && !rightDisabled)
                        {
                            $('#' + id).removeClass('hide').addClass('show');

                            currentViewSetSize = currentViewSetSize + currentViewSize;
                        }
                        else
                        {
                            rightDisabled = true;
                        }
                    }
                }
            });
        });
    }

    private rebuildModules(view:TerraMultiSplitViewInterface, module:TerraMultiSplitViewDetail):void
    {
        if(isNullOrUndefined(view))
        {
            return;
        }

        let hierarchyLevel:number = this.getHierarchyLevelOfView(view);

        // cut off last elements
        this.modules = this.modules.slice(0, hierarchyLevel + 1);

        // rebuild
        if(!isNullOrUndefined(view.children))
        {
            view.children.forEach((child) =>
                {
                    // add view to the modules array
                    this.addToModulesIfNotExist(child);

                    // set selected view and rebuild sub tree for children
                    this.setSelectedView(child);
                }
            );
        }

        // update the corresponding module's current- and lastSelectedView
        let moduleView:TerraMultiSplitViewInterface = module.views.find((v) => v === view);

        // an existing view has been SELECTED?
        if(moduleView)
        {
            module.lastSelectedView = module.currentSelectedView;
            module.currentSelectedView = view;

            // also set the width of the view
            module.width = !isNullOrUndefined(view.focusedWidth) ? view.focusedWidth : view.defaultWidth;
        }
    }

    private removeFromModules(view:TerraMultiSplitViewInterface):TerraMultiSplitViewInterface
    {
        // check whether view is null or undefined
        if(isNullOrUndefined(view))
        {
            // ERROR... stop further execution
            return view;
        }

        // get the corresponding module
        let module = this.getModuleOfView(view);

        // check whether module is defined
        if(isNullOrUndefined(module))
        {
            // ERROR... stop further execution
            return view;
        }

        // delete all children only if the view is selected and the children are rendered
        if(view === module.currentSelectedView)
        {
            if(!isNullOrUndefined(view.children))
            {
                view.children.forEach((elem) =>
                    {
                        this.removeFromModules(elem);
                    }
                );
            }
        }

        // check if module has more than one view
        if(module.views.length <= 1)
        {
            // get the index of the module in the modules array
            let moduleIndex:number = this.modules.findIndex((mod) => mod === module);

            // check if the module has been found
            if(moduleIndex >= 0 && moduleIndex < this.modules.length)
            {
                // remove the whole module
                this.modules.splice(moduleIndex, 1);

                // select the views parent view
                return view.parent;
            }
        }
        else
        {
            // get the index of the view in the module's views array
            let viewIndex:number = module.views.findIndex((elem) => elem === view);

            // check if the view has been found
            if(viewIndex >= 0 && viewIndex < module.views.length)
            {
                // remove view from module's views array
                module.views.splice(viewIndex, 1);
            }

            // return the view that should be selected after deletion
            if(module.currentSelectedView === view && this.inputConfig.currentSelectedView === view)
            {
                return this.getLastSelectedOfModule(module);
            }
            else
            {
                // check if vertical selection has to be changed
                if(module.currentSelectedView === view)
                {
                    // rebuild modules array depending on the selected view
                    this.rebuildModules(this.getLastSelectedOfModule(module), module);

                }
                // do not change anything -> select the currently selected view
                return this.inputConfig.currentSelectedView;
            }
        }
    }

    protected getModuleOfView(view):TerraMultiSplitViewDetail
    {
        // get hierarchy level of deleted view
        let hierarchyLevel:number = this.getHierarchyLevelOfView(view);

        return this.modules[hierarchyLevel];
    }

    private getHierarchyLevelOfView(view:TerraMultiSplitViewInterface):number
    {
        let hierarchyLevel:number = 0;
        let parent:TerraMultiSplitViewInterface = view.parent;
        while(!isNullOrUndefined(parent))
        {
            parent = parent.parent;
            hierarchyLevel++;
        }

        return hierarchyLevel;
    }

    private resizeViewAndModule(view:TerraMultiSplitViewInterface):void
    {
        let module:TerraMultiSplitViewDetail = this.getModuleOfView(view);

        module.width = view.defaultWidth;
    }

    private removeView(view:TerraMultiSplitViewInterface, event:Event):void
    {
        // stop event bubbling
        event.stopPropagation();

        // remove the selected view
        this.inputConfig.removeView(view);
    }

    private routeExists(route:string):boolean
    {
        // get the partials of the route
        let path:Array<string> = route.split('/');

        // start at element 1 not 0, since the route starts with a separator
        let routeLevel:number = 1;

        // get the routing config
        let routes:Routes = this._router.config;

        // scan the routing config
        while(routeLevel < path.length)
        {
            if(isNullOrUndefined(routes))
            {
                return false;
            }

            // search the array for the route partial
            let foundRoute = routes.find((route) => route.path === path[routeLevel]);
            if(foundRoute) // the route partial is defined?
            {
                // into deep
                routeLevel++;
                routes = foundRoute.children;
            }
            else
            {
                return false;
            }
        }

        // if the while loop ends, the route exists
        return true;
    }

    private getLastSelectedOfModule(module:TerraMultiSplitViewDetail):TerraMultiSplitViewInterface
    {
        if(module.lastSelectedView && module.views.find((v:TerraMultiSplitViewInterface) => v === module.lastSelectedView))
        {
            return module.lastSelectedView;
        }

        // select the first view in the views array
        return module.views[0];
    }
}
