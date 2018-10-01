import { TranslationService } from 'angular-l10n';
import { TerraStopwatchComponent } from './terra-stopwatch.component';

describe('Component: TerraStopwatchComponent', () =>
{
    let translationService:TranslationService;
    let component:TerraStopwatchComponent = new TerraStopwatchComponent(translationService);

    beforeEach(() =>
    {
        component.ngOnInit();
    });

    afterEach(() =>
    {
        component.resetStopwatch();
        component.inputIsAutoPlay = false;
    });

    it('should create an instance of TerraStopwatchComponent', () =>
    {
        expect(component).toBeTruthy();
    });

    it('should auto run the stopwatch', (done:any) =>
    {
        component.inputIsAutoPlay = true;
        component.ngOnInit();
        setTimeout(() =>
        {
            expect(component.getStopwatchTimeInMilliseconds()).toBeGreaterThan(0);
            done();
        }, 100);
    });

    it('should not auto run the stopwatch', () =>
    {
        component.inputIsAutoPlay = false;
        component.ngOnInit();
        expect(component.getStopwatchTimeInMilliseconds()).toEqual(0);
    });

    it('should start stopwatch and reset value to 0', (done:any) =>
    {
        component.startStopwatch();
        setTimeout(() =>
        {
            expect(component.getStopwatchTimeInMilliseconds()).toBeGreaterThan(0);
            component.resetStopwatch();
            expect(component.getStopwatchTimeInMilliseconds()).toEqual(0);
            done();
        }, 100);
    });

    it('should start and stop stopwatch', (done:any) =>
    {
        component.startStopwatch();
        let time:number;
        setTimeout(() =>
        {
            expect(component.getStopwatchTimeInMilliseconds()).toBeGreaterThan(0);
            component.stopStopwatch();
            time = component.getStopwatchTimeInMilliseconds();
        }, 100);
        setTimeout(() =>
        {
            expect(component.getStopwatchTimeInMilliseconds()).toEqual(time);
            done();
        }, 200);
    });
});
