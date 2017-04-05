import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoAutorizadoRoutingModule } from './noautorizado-routing.module';
import { NoAutorizadoComponent } from './noautorizado.component';

@NgModule({
  imports: [
    CommonModule,
    NoAutorizadoRoutingModule
  ],
  declarations: [NoAutorizadoComponent]
})
export class NoAutorizadoModule { }
