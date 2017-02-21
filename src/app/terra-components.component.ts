import {
    Component,
    OnInit,
    ViewContainerRef,
    ViewChild
} from '@angular/core';
import {
    LocaleService,
    LocalizationService,
    Locale
    
} from 'angular2localization';
import { TerraOverlayComponent } from './overlay/terra-overlay.component';
import { TerraOverlayButtonInterface } from './overlay/data/terra-overlay-button.interface';

@Component({
               selector: 'app-root',
               template: require('./terra-components.component.html'),
               styles:   [require('./terra-components.component.scss')]
           })
export class TerraComponentsComponent extends Locale implements OnInit
{
    private _viewContainerRef:ViewContainerRef;
    
    @ViewChild('overlay') overlay:TerraOverlayComponent;
    private _primaryButtonInterface:TerraOverlayButtonInterface;
    private _secondaryButtonInterface:TerraOverlayButtonInterface;
    
    public constructor(private viewContainerRef:ViewContainerRef,
                       public local:LocaleService,
                       public localization:LocalizationService)
    {
        super(local, localization);
        
        // You need this small hack in order to catch application root view container ref
        this._viewContainerRef = viewContainerRef;
        
        //Definitions for i18n
        if(process.env.ENV === 'production')
        {
            this.localization.translationProvider('app/resources/locale_');
        }
        else
        {
            this.localization.translationProvider('src/app/resources/locale_');
        }
        
        this.locale.addLanguage('de');
        this.locale.addLanguage('en');
        this.locale.definePreferredLocale('en', 'EN', 30); //default language is en
        
        let langInLocalStorage:string = localStorage.getItem('plentymarkets_lang_');
        
        if(langInLocalStorage != null)
        {
            this.locale.setCurrentLocale(langInLocalStorage, langInLocalStorage.toUpperCase());
        }
        else
        {
            let lang = navigator.language.slice(0, 2).toLocaleLowerCase();
            
            if(lang !== 'de' && lang !== 'en')
            {
                lang = 'en';
            }
            
            this.locale.setCurrentLocale(lang, lang.toUpperCase());
            localStorage.setItem('plentymarkets_lang_', lang);
        }
        
        this.localization.updateTranslation();
    }
    
    ngOnInit()
    {
        this.primaryButtonInterface = {
            icon:          'icon-save',
            caption:       'Speichern',
            tooltipText:   'Test',
            isDisabled:    false,
            clickFunction: () => this.closeOverlay()
        };
        
        this.secondaryButtonInterface = {
            icon:          'icon-cancel',
            caption:       'Cancel',
            tooltipText:   'TEST',
            isDisabled:    false,
            clickFunction: () => this.closeOverlay()
        };
    }
    
    toggle()
    {
        this.overlay.showOverlay();
    }
    
    closeOverlay()
    {
        this.overlay.hideOverlay();
    }
    
    public get primaryButtonInterface():TerraOverlayButtonInterface
    {
        return this._primaryButtonInterface;
    }
    
    public set primaryButtonInterface(value:TerraOverlayButtonInterface)
    {
        this._primaryButtonInterface = value;
    }
    
    public get secondaryButtonInterface():TerraOverlayButtonInterface
    {
        return this._secondaryButtonInterface;
    }
    
    public set secondaryButtonInterface(value:TerraOverlayButtonInterface)
    {
        this._secondaryButtonInterface = value;
    }
}
