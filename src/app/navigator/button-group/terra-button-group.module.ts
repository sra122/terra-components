import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraButtonGroupComponent } from './terra-button-group.component';
import { TerraButtonComponent } from '../../button/terra-button.component';
import { TooltipModule } from 'ng2-bootstrap';

@NgModule({
              imports:      [
                  CommonModule,
                  TooltipModule.forRoot(),
              ],
              declarations: [
                  TerraButtonGroupComponent,
                  TerraButtonComponent
              ]
          })
export class TerraButtonGroupModule
{
    static forRoot()
    {
        return {
            ngModule:  TerraButtonGroupModule,
            providers: []
        };
    }
}
