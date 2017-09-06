export enum RulerUnit {
    PX,
    PT,
    EM,
    REM,
    CM,
    MM
}

export class Ruler
{
    private value:number;
    private unit:RulerUnit;
    private reference:number;

    constructor(value:number, unit:RulerUnit = RulerUnit.PX, reference:number | Ruler | HTMLElement = document.body)
    {
        this.value = value;
        this.unit = unit;

        if(typeof reference === "number")
        {
            this.reference = reference;
        }
        else if(reference instanceof Ruler)
        {
            this.reference = reference.getValue();
        }
        else if(reference instanceof HTMLElement)
        {
            this.reference = Ruler.parse(
                window.getComputedStyle(reference).fontSize
            ).getValue();
        }
    }

    public static parse(valueString:string):Ruler
    {
        let value = parseFloat(valueString);
        let unit = RulerUnit.PX;
        let unitExp = new RegExp(/^\d+(\.\d+)?(\w+)$/);
        if(unitExp.test(valueString))
        {
            let unitString = unitExp.exec(valueString)[2].toLowerCase();
            switch(unitString)
            {
                case "px":
                    unit = RulerUnit.PX;
                    break;
                case "pt":
                    unit = RulerUnit.PT;
                    break;
                case "em":
                    unit = RulerUnit.EM;
                    break;
                case "rem":
                    unit = RulerUnit.REM;
                    break;
                case "cm":
                    unit = RulerUnit.CM;
                    break;
                case "mm":
                    unit = RulerUnit.MM;
                    break;
                default:
                    console.error("Cannot parse unit from string: " + valueString);
                    break;
            }
        }

        return new Ruler(value, unit, parseFloat(window.getComputedStyle(document.body).fontSize));
    }

    public getValue(unit:RulerUnit = RulerUnit.PX):number
    {
        let px2cm = () =>
        {
            let tmp = new HTMLDivElement();
            let result;
            tmp.style.width = "100cm";
            tmp.style.height = "100cm";
            document.body.appendChild(tmp);
            result = this.toPixel() / (tmp.clientWidth / 100);
            tmp.remove();
            return result;
        };


        switch(unit)
        {
            case RulerUnit.PX:
                return this.toPixel();
            case RulerUnit.PT:
                return this.toPixel() * 0.75;
            case RulerUnit.EM:
            case RulerUnit.REM:
                return this.toPixel() / this.reference;
            case RulerUnit.CM:
                return px2cm();
            case RulerUnit.MM:
                return px2cm() * 10;


        }
        return 0;
    }

    private toPixel()
    {
        let cm2px = (cmValue:number) =>
        {
            let tmp = document.createElement("DIV");
            let result;

            tmp.style.width = cmValue + "cm";
            tmp.style.height = cmValue + "cm";
            document.body.appendChild(tmp);
            result = tmp.clientWidth;
            tmp.remove();
            return result;
        };

        switch(this.unit)
        {
            case RulerUnit.PX:
                return this.value;
            case RulerUnit.PT:
                return this.value * (4 / 3);
            case RulerUnit.EM:
            case RulerUnit.REM:
                return this.value * this.reference;
            case RulerUnit.CM:
                return cm2px(this.value);
            case RulerUnit.MM:
                return cm2px(this.value / 10);
        }
    }
}