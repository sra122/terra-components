import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

@Component({
    selector: 'terra-dimension-input',
    template: require('./dimension-input.component.html'),
    styles: [require('./dimension-input.component.scss')]
})
export class TerraDimensionInputComponent
{
    private _width: number = 0;
    private _height: number = 0;

    @Input()
    public set inputWidth(value: number)
    {
        this._width = Math.round(value);
    }

    public get inputWidth():number
    {
        return this._width;
    }

    @Input()
    public set inputHeight(value: number)
    {
        this._height = Math.round(value);
    }

    public get inputHeight():number
    {
        return this._height;
    }

    @Output()
    public inputWidthChange:EventEmitter<number> = new EventEmitter();

    @Output()
    public inputHeightChange:EventEmitter<number> = new EventEmitter();

    public preserveRatio:boolean = true;

    public setWidth( value: number )
    {
        if ( this.preserveRatio )
        {
            this.inputHeight = value / (this.inputWidth / this.inputHeight );
            this.inputHeightChange.emit(this.inputHeight);
        }

        this.inputWidth = value;
        this.inputWidthChange.emit(this.inputWidth);
    }

    public setHeight( value: number )
    {
        if ( this.preserveRatio )
        {
            this.inputWidth = value * (this.inputWidth / this.inputHeight );
            this.inputWidthChange.emit( this.inputWidth );
        }

        this.inputHeight = value;
        this.inputHeightChange.emit(this.inputHeight);
    }
}