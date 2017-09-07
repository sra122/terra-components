import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { DndEditorElementProperty } from '../../model/dnd-editor-element-property.decorator';
import { PropertyInputComponent } from './property-input-components/property-input-component.interface';


@Component({
    selector: 'dnd-editor-property-input',
    template: '<div #container></div>'
})
export class ElementPropertyInputComponent implements OnInit, OnChanges
{

    @Input()
    public property:DndEditorElementProperty;

    @Input()
    public value:any;

    @Output()
    public valueChange:EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('container', {read: ViewContainerRef})
    private container:ViewContainerRef;

    private inputComponent:ComponentRef<PropertyInputComponent<any>>;

    constructor(private componentFactoryResolver:ComponentFactoryResolver,
                private changeDetector:ChangeDetectorRef)
    {
    }

    public ngOnInit():void
    {
        let inputComponentType:Type<PropertyInputComponent<any>> = this.property.type;

        this.inputComponent = this.container.createComponent(
            this.componentFactoryResolver.resolveComponentFactory(inputComponentType)
        );

        this.inputComponent.instance.property = this.property;
        this.inputComponent.instance.value = this.value;
        this.inputComponent.instance.valueChange.subscribe(newValue =>
        {
            this.value = newValue;
            this.valueChange.emit(newValue);
            this.changeDetector.detectChanges();
        });
    }

    public ngOnChanges(changes:SimpleChanges):void
    {
        if(changes.hasOwnProperty("value") && this.inputComponent)
        {
            this.inputComponent.instance.value = this.value;
        }
    }
}