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
import { EditorPropertyInterface } from '../../model/dnd-editor-property.decorator';
import { PropertyInputComponent } from './property-input-components/property-input-component.interface';


@Component({
    selector: 'dnd-editor-property-input',
    template: '<div #container></div>'
})
export class ElementPropertyInputComponent implements OnInit, OnChanges
{

    // The editor property to render input for
    @Input()
    public property:EditorPropertyInterface;

    // The current value of the property
    @Input()
    public value:any;

    // Emits on changes to the property value
    @Output()
    public valueChange:EventEmitter<any> = new EventEmitter<any>();

    // referenes the container to render input component into
    @ViewChild('container', {read: ViewContainerRef})
    private container:ViewContainerRef;

    // the rendered input component defined in the editor property
    private inputComponent:ComponentRef<PropertyInputComponent<any>>;

    constructor(private componentFactoryResolver:ComponentFactoryResolver,
                private changeDetector:ChangeDetectorRef)
    {
    }

    public ngOnInit():void
    {
        let inputComponentType:Type<PropertyInputComponent<any>> = this.property.type;

        // render the assigned input component
        this.inputComponent = this.container.createComponent(
            this.componentFactoryResolver.resolveComponentFactory(inputComponentType)
        );

        // pass variables to rendered input component
        this.inputComponent.instance.property = this.property;
        this.inputComponent.instance.value = this.value;
        this.inputComponent.instance.valueChange.subscribe(newValue =>
        {
            // pass change events to parent components
            this.value = newValue;
            this.valueChange.emit(newValue);
            this.changeDetector.detectChanges();
        });
    }

    public ngOnChanges(changes:SimpleChanges):void
    {
        if(changes.hasOwnProperty("value") && this.inputComponent)
        {
            // pass changes on value to rendered input component
            this.inputComponent.instance.value = this.value;
        }
    }
}