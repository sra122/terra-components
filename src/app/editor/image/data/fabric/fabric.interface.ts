export interface Fabric
{
    Canvas: StaticFabricCanvas;
    Image: StaticFabricImage;
    Point: StaticFabricPoint;
}

export type FabricCanvasEventType = "before:render"
    | "after:render"
    | "canvas:cleared"
    | "object:added"
    | "object:removed"
    | "object:modified"
    | "object:rotating"
    | "object:scaling"
    | "object:moving"
    | "before:selection:cleared"
    | "selection:cleared"
    | "selection:updated"
    | "selection:created"
    | "path:created"
    | "mouse:down"
    | "mouse:move"
    | "mouse:move"
    | "mouse:up"
    | "mouse:over"
    | "mouse:out"
    | "mouse:dblclick";

export type FabricObjectEventType = "added"
    | "removed"
    | "selected"
    | "deselected"
    | "modified"
    | "scaling"
    | "rotating"
    | "moving"
    | "skewing"
    | "mousedown"
    | "mouseup"
    | "mouseover"
    | "mouseout"
    | "mousewheel"
    | "mousedblclick"

export interface FabricEvent
{
    button:number;
    e: Event;
    isClick: boolean;
    subTargets: FabricObject[];
    target: FabricObject
}

export type FxCallbacks = {
    onComplete?: () => void,
    onChange?: () => void
};

export type DataURLOptions = {
    format?:string,
    quality?:number,
    multiplier?:number,
    left?:number,
    top?:number,
    width?:number,
    height?:number,
    enableRetina?:boolean
};

export interface StaticFabricStaticCanvas
{
    supports(methodName:string):boolean|null;
}

export interface FabricStaticCanvas
{
    allowTouchScrolling:boolean;
    backgroundColor:string;
    backgroundImage:FabricImage;
    backgroundVpt:boolean;
    controlsAboveOverlay:boolean;
    enableRetinaScaling:boolean;
    FX_DURATION:number;
    imageSmoothingEnabled:boolean;
    includeDefaultValues:boolean;
    overlayColor:string;
    overlayImage:FabricImage;
    overlayVpt:boolean;
    renderOnAddRemove:boolean;
    skipOffscreen:boolean;
    stateful:boolean;
    svgViewportTransformation:boolean;
    viewportTransform:any[];
    vptCoords:any;

    absolutePan(point:FabricPoint):FabricCanvas;
    add(...object:FabricObject[]):FabricStaticCanvas;
    bringForward(object:FabricObject,intersecting?:boolean):FabricCanvas;
    bringToFront(object:FabricObject):FabricCanvas;
    calcOffset():FabricCanvas;
    calcViewportBoundaries():{tl:FabricPoint, tr:FabricPoint, bl:FabricPoint, br:FabricPoint};
    centerObject(object:FabricObject):FabricCanvas;
    centerObjectH(object:FabricObject):FabricCanvas;
    centerObjectV(object:FabricObject):FabricCanvas;
    clear():FabricCanvas;
    clearContext(ctx:CanvasRenderingContext2D):FabricCanvas;
    clone(callback?:(clone:FabricCanvas)=>void,properties?:any[]):void;
    cloneWithoutData(callback?:(clone:FabricCanvas)=>void):void;
    complexity():number;
    contains(object:FabricObject):boolean;
    createSVGFontFacesMarkup(objects:FabricObject[]):string;
    createSVGRefElementsMarkup():string;
    dispose():FabricCanvas;
    forEachObject(callback:(object:FabricObject,index?:number,objects?:FabricObject[])=>void,thisArg?:any):void;
    fxCenterObjectH(object:FabricObject,callbacks?:FxCallbacks):FabricCanvas;
    fxCenterObjectV(object:FabricObject,callbacks?:FxCallbacks):FabricCanvas;
    fxRemove(object:FabricObject,callbacks?:FxCallbacks):FabricCanvas;
    fxStraightenObject(object:FabricObject):FabricCanvas;
    getCenter():{top:number,left:number};
    getContext():CanvasRenderingContext2D;
    getElement():HTMLCanvasElement;
    getHeight():number;
    getObjects(type?:string):FabricObject[];
    getVpCenter():FabricPoint;
    getWidth():number;
    getZoom():number;
    initialize(el:HTMLElement|string,options?:any):FabricCanvas;
    insertAt(object:FabricObject,index:number,nonSplicing:boolean):FabricCanvas;
    isEmpty():boolean;
    item(index:number):FabricObject;
    loadFromDatalessJSON(json:string|object,callback:()=>void,reviver?:()=>void):FabricCanvas;
    loadFromJSON(json:string|object,callback:()=>void,reviver?:()=>void):FabricCanvas;
    moveTo(object:FabricObject,index:number):FabricCanvas;
    off(eventName:FabricCanvasEventType, handler:(e:FabricEvent)=>void):FabricStaticCanvas;
    off(events:{[event:string]:(e:FabricEvent)=>void}):FabricStaticCanvas;
    on(eventName:FabricCanvasEventType, handler:(e:FabricEvent)=>void):FabricStaticCanvas;
    on(events:{[event:string]:(e:FabricEvent)=>void}):FabricStaticCanvas;
    onBeforeScaleRotate():FabricStaticCanvas;
    relativePan(point:FabricPoint):FabricCanvas;
    remove(...object:FabricObject[]):FabricStaticCanvas;
    renderAll():FabricCanvas;
    renderAndReset():FabricCanvas;
    renderCanvas(ctx:CanvasRenderingContext2D,objects:FabricObject[]):FabricCanvas;
    requestRenderAll():FabricCanvas;
    sendBackwards(object:FabricObject,intersecting?:boolean):FabricCanvas;
    sendToBack(object:FabricObject):FabricCanvas;
    setBackgroundColor(color:string,callback:()=>void):FabricCanvas;
    setBackgroundImage(image:FabricImage,callback:()=>void,options?:any):FabricCanvas;
    setDimensions(dimensions:{width:number|string,height:number|string},options?:{backstoreOnly?:Boolean,cssOnly?:boolean}):FabricCanvas;
    setHeight(value:number|string,options?:{backstoreOnly?:Boolean,cssOnly?:boolean});
    setOverlayColor(color:string,callback:()=>void):FabricCanvas;
    setOverlayImage(image:FabricImage|string,callback:()=>void,options?:any):FabricCanvas;
    setViewportTransform(vpt:any):FabricCanvas;
    setWidth(value:number|string,callback?:()=>void):FabricCanvas;
    setZoom(value:number):FabricCanvas;
    size():number;
    straightenObject(object:FabricObject):FabricCanvas;
    toDatalessJSON(propertiesToInclude?:any[]):string;
    toDataURL(options?:DataURLOptions):string;
    toJSON(propertiesToInclude?:any[]):string;
    toObject(propertiesToInclude?:any[]):any;
    toString():string;
    trigger(eventName:FabricCanvasEventType, options?:any):FabricCanvas;
    viewportCenterObject(object:FabricObject):FabricCanvas;
    viewportCenterObjectH(object:FabricObject):FabricCanvas;
    viewportCenterObjectV(object:FabricObject):FabricCanvas;
    zoomToPoint(point:FabricPoint,value:number):FabricCanvas;
}

/*
 * CANVAS
 */
export interface StaticFabricCanvas extends StaticFabricStaticCanvas
{
    new (canvas:HTMLElement|string, options?:any): FabricCanvas;
}

export interface FabricCanvas extends FabricStaticCanvas
{
    altActionKey:string|null;
    altSelectionKey:string|null
    centeredKey:string|null;
    centeredRotation:boolean;
    centeredScaling:boolean;
    containerClass:string;
    defaultCursor:string;
    fireMiddleClick:boolean;
    freeDrawingCursor:string;
    height:number;
    hoverCursor:string;
    interactive:boolean;
    isDrawingMode:boolean;
    moveCursor:string;
    notAllowedCursor:string;
    perPixelTargetFind:boolean;
    preserveObjectStacking:boolean;
    rotationCursor:string;
    selection:boolean;
    selectionBorderColor:string;
    selectionColor:string;
    selectionDashArray:any[];
    selectionKey:string|null;
    selectionLineWidth:number;
    skipTargetFind:boolean;
    snapAngle:number;
    snapTreshold:number|null;
    stopContextMenu:boolean;
    targetFindTolerance:number;
    uniScaleKey:string;
    uniScaleTransform:boolean;
    width:number;

    containsPoint(e:Event,target:FabricObject,point?:{x:number,y:number}):boolean;
    discardActiveObject(e?:Event):FabricCanvas;
    drawControls(ctx:CanvasRenderingContext2D):void;
    findTarget(e:Event,skipGroup:boolean):any;
    getActiveObject():FabricObject;
    getActiveObjects():FabricObject[];
    getPointer(e:Event,ignoreZoom:boolean):{x:number,y:number};
    getSelectionContext():CanvasRenderingContext2D;
    getSelectionElement():HTMLCanvasElement;
    initialize(element:HTMLCanvasElement|string,options?:any):FabricCanvas;
    isTargetTransparent(target:FabricObject,x:number,y:number):boolean;
    removeListeners():void;
    renderTop():FabricCanvas;
    restorePointerVpt(pointer:{x:number,y:number}):{x:number,y:number};
    setActiveObject(object:FabricObject,event?:Event):FabricCanvas;
    setCursor(value:string):void;
}

/*
 * OBJECT
 */
export type oCoordProperty = {
    x: number,
    y: number,
    corner: {
        tl: FabricPoint,
        tr: FabricPoint,
        bl: FabricPoint,
        br: FabricPoint
    }
};

export interface FabricObject
{
    aCoords: {tl:FabricPoint, tr:FabricPoint, bl:FabricPoint, br:FabricPoint};
    angle:number;
    backgroundColor:string;
    borderColor:string;
    borderDashArray:any[]
    borderOpacityWhenMoving:number;
    borderScaleFactor:number;
    cacheProperties:any[]
    centeredRotation:boolean;
    centeredScaling:boolean;
    cornerColor:string;
    cornerDashArray:any[];
    cornerSize:number;
    cornerStrokeColor:string;
    cornerStyle:"rect"|"circle";
    dirty:boolean;
    evented:boolean;
    excludeFromExport:boolean;
    fill:string;
    fillRule:string;
    flipX:boolean;
    flipY:boolean;
    globalCompositeOperation:string;
    hasBorders:boolean;
    hasControls:boolean;
    hasRotatingPoint:boolean;
    height:number;
    hoverCursor:string;
    includeDefaultValues:boolean;
    left:number;
    lockMovementX:boolean;
    lockMovementY:boolean;
    lockRotation:boolean;
    lockScalingFlip:boolean;
    lockScalingX:boolean;
    lockScalingY:boolean;
    lockSkewingX:boolean;
    lockSkewingY:boolean;
    lockUniScaling:boolean;
    minScaleLimit:number;
    moveCursor:string;
    noScaleCache:boolean;
    objectCaching:boolean;
    oCoords:{
        tl: oCoordProperty,
        mt: oCoordProperty,
        tr: oCoordProperty,
        ml: oCoordProperty,
        mr: oCoordProperty,
        bl: oCoordProperty,
        mb: oCoordProperty,
        br: oCoordProperty,
        mtr: oCoordProperty

    },
    opacity:number;
    originX:number;
    originY:number;
    padding:number;
    paintFirst:"fill"|"stroke";
    perPixelTargetFind:boolean;
    rotatingPointOffset:number;
    scaleX:number;
    scaleY:number;
    selectable:boolean;
    selectionBackgroundColor:string;
    //shadow: any
    skewX:number;
    skewY:number;
    statefullCache:boolean;
    stateProperty:any[];
    stroke:string;
    strokeDashArray:any[];
    strokeLineCap:"butt"|"round"|"square";
    strokeLineJoin:"bevil"|"round"|"miter";
    strokeMiterLimit:number;
    strokeWidth:number;
    top:number;
    transformMatrix:any[];
    transparentCorners:boolean;
    type:string;
    visible:boolean;
    width:number;

    adjustPosition(to:"left"|"center"|"right"):void;
    animate(property:string, value: any):FabricObject;
    animate(properties:{[property:string]:any}):FabricObject;
    bringForward(intersect:boolean):FabricObject;
    bringToFront():FabricObject;
    calcCoords():{tl: FabricPoint, tr: FabricPoint, br: FabricPoint, bl: FabricPoint};
    calcTransformMatrix(skipGroup:boolean):any[];
    center():FabricObject;
    centerH():FabricObject;
    centerV():FabricObject;
    clone(callback:(clone:FabricObject) => void, propertiesToInclude?:any[]):FabricObject;
    cloneAsImage(callback:(image:FabricImage) => void, options?:{enableRetinaScaling:boolean}):FabricObject;
    complexity():number;
    containsPoint(point:FabricPoint,lines?:any,absolute?:boolean,calculate?:boolean):boolean;
    drawBorders(ctx:CanvasRenderingContext2D,styleOverride:any):FabricObject;
    drawBordersInGroup(ctx:CanvasRenderingContext2D,options:any,styleOverride:any):FabricObject;
    drawCacheOnCanvas(ctx:CanvasRenderingContext2D):void;
    drawControls(ctx:CanvasRenderingContext2D,styleOverride:any):FabricObject;
    drawObject(ctx:CanvasRenderingContext2D):void;
    drawSelectionBackground(ctx:CanvasRenderingContext2D):void;
    fxStraighten(callbacks:FxCallbacks):void;
    getBoundingRect(absolute?:boolean,calculate?:boolean):{left:number,top:number,width:number,height:number};
    getCenterPoint():FabricPoint;
    getCoords():any;
    getLocalPointer(e:Event,pointer?:any):{x:number,y:number};
    getObjectOpacity():number;
    getObjectScaling():{scaleX:number,scaleY:number};
    getPointByOrigin(originX:"left"|"center"|"right",originY:"top"|"center"|"bottom"):FabricPoint;
    getScaledHeight():number;
    getScaledWidth():number;
    getSvgFilter():string;
    getSvgId():string;
    getSvgStyles(skipShadow:boolean):string;
    getSvgTransform():string;
    getSvgTransformMatricx():string;
    getViewportTransform():boolean;
    hasStateChanged(propertySet?:string):boolean;
    initialize(options?:any):void;
    intersectsWithObject(object:FabricObject,absolute?:boolean,calculate?:boolean):boolean;
    intersectsWithRect(topLeft:FabricPoint,bottomRight:FabricPoint,absolute?:boolean,calculate?:boolean):boolean;
    isCacheDirty(skipCanvas:boolean):boolean;
    isContainedWithinObject(object:FabricObject,absolute?:boolean,calculate?:boolean):boolean;
    isContainedWithinRect(topLeft:FabricPoint,bottomRight:FabricPoint,absolute?:boolean,calculate?:boolean):boolean;
    isControlVisible(controlName:"tl"|"tr"|"br"|"bl"|"ml"|"mt"|"mr"|"mb"|"mtr"):boolean;
    isOnScreen(calculate?:boolean):boolean;
    isType(type:string):boolean;
    moveTo(index:number):FabricObject;
    onDeselect(options?:{e?:Event}):void;
    onSelect(options?:{e?:Event}):void;
    render(ctx:CanvasRenderingContext2D):void;
    rotate(angle:number):FabricObject;
    saveState(options?:{stateProperties:any[]}):FabricObject;
    scale(value:number):FabricObject;
    scaleToHeight(value:number,absolute?:boolean):FabricObject;
    scaleToWidth(value:number,absolute?:boolean):FabricObject;
    sendBackwards(intersecting?:boolean):FabricObject;
    sendToBack():FabricObject;
    setColor(color:string):FabricObject;
    setControlVisibility(options?:{bl?:boolean,br?:boolean,mb?:boolean,ml?:boolean,mr?:boolean,mt?:boolean,tl?:boolean,tr?:boolean,mtr?:boolean}):FabricObject;
    setControlVisible(controlName:"tl"|"tr"|"br"|"bl"|"ml"|"mt"|"mr"|"mb"|"mtr",visible:boolean): FabricObject;
    setCoords(ignoreZoom?:boolean,skipAbsolute?:boolean):FabricObject;
    setGradient(property:"stroke"|"fill",options?:{type?:"radial"|"linear",x1?:number,x2?:number,y1?:number,y2?:number,r1?:number,r2?:number,colorStops?:any,gradientTransform?:any}):FabricObject;
    setOnGroup():void;
    setOptions(options?:any):void;
    setPatternFill(options?:any):FabricObject;
    setPositionByOrigin(position:FabricPoint,originX:"left"|"center"|"right",originY:"top"|"center"|"bottom"):void;
    setShadow(options?:string|{color?:string,blur?:number,offsetX?:number,offsetY?:number}):FabricObject;
    setupState(options?:{stateProperties:any[]}):FabricObject;
    shouldCache():boolean;
    straighten():FabricObject;
    toDatalessObject(propertiesToInclude?:any[]):any;
    toDataURL(options:DataURLOptions);
    toJSON(propertiesToInclude?:any[]):any;
    toLocalPoint(point:FabricPoint,originX:"left"|"center"|"right",originY:"top"|"center"|"bottom");
    toObject(propertiesToInclude?:any[]):any;
    toString():string;
    transform(ctx:CanvasRenderingContext2D,fromLeft:boolean);
    translateToCenterPoint(point:FabricPoint,originX:"left"|"center"|"right",originY:"top"|"center"|"bottom");
    translateToGivenOrigin(point:FabricPoint,fromOriginX:"left"|"center"|"right",fromOriginY:"top"|"center"|"bottom",toOriginX:"left"|"center"|"right",toOriginY:"top"|"center"|"bottom"):FabricPoint;
    translateToOriginPoint(center:FabricPoint,originX:"left"|"center"|"right",originY:"top"|"center"|"bottom"):FabricPoint;
    viewportCenter():FabricObject;
    viewportCenterH():FabricObject;
    viewportCenterV():FabricObject;
    willDrawShadow():boolean;

    off(eventName:FabricObjectEventType, handler:(e:FabricEvent)=>void):FabricObject;
    off(events:{[event:string]:(e:FabricEvent)=>void}):FabricObject;
    on(eventName:FabricObjectEventType, handler:(e:FabricEvent)=>void):FabricObject;
    on(events:{[event:string]:(e:FabricEvent)=>void}):FabricObject;
}

/*
 * IMAGE
 */
export interface StaticFabricImage
{
    new (image:HTMLElement): FabricImage;
    fromURL(url:string, callback:(img:FabricImage) => void, options?:any):void
    fromElement(element:SVGElement,options?:any,callback?:(img:FabricImage)=>void):FabricImage;
    fromObject(object:any,callback:(img:FabricImage)=>void):void;
}

export interface FabricImage extends FabricObject
{
    cacheKey:string;
    cropX:number;
    cropY:number;
    crossOrigin:"anonymous"|"use-credentials";
    minimumScaleTrigger:number;

    getElement():HTMLImageElement;
    getOriginalSize():{width:number,height:number};
    getSrc(filtered:boolean):string;
    initialize(element:HTMLImageElement|string,options?:any,callback?:()=>void):FabricImage;
    setElement(element:HTMLImageElement,options?:any):FabricImage;
    setSrc(src:string,callback?:()=>void,options?:any):FabricImage;
}

/*
 * POINT
 */
export interface StaticFabricPoint
{
    new (x:number,y:number): FabricPoint
}

export interface FabricPoint
{
    x:number;
    y:number;
    add(point:FabricPoint):FabricPoint;
    addEquals(point:FabricPoint):FabricPoint;
    clone():FabricPoint;
    distanceFrom(point:FabricPoint):number;
    divide(scalar:number):FabricPoint;
    divideEquals(scalar:number):FabricPoint;
    eq(point:FabricPoint):boolean;
    gt(point:FabricPoint):boolean;
    gte(point:FabricPoint):boolean;
    lerp(point:FabricPoint,t:number):FabricPoint;
    lt(point:FabricPoint):boolean;
    lte(point:FabricPoint):boolean;
    max(point:FabricPoint):FabricPoint;
    midPointFrom(point:FabricPoint):FabricPoint;
    min(point:FabricPoint):FabricPoint;
    multiply(scalar:number):FabricPoint;
    multiplyEquals(scalar:number):FabricPoint;
    scalarAdd(scalar:number):FabricPoint;
    scalarAddEquals(scalar:number):FabricPoint;
    scalarSubtract(scalar:number):FabricPoint;
    scalarSubstractEqual(scalar:number):FabricPoint;
    setPointFrom(point:FabricPoint):void;
    setX(x:number):void;
    setXY(x:number,y:number):void;
    setY(y:number):void;
    subtract(point:FabricPoint):FabricPoint;
    subtractEquals(point:FabricPoint):FabricPoint;
    swap(point:FabricPoint):void;
    toString():string;
}