import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NoAutorizadoComponent} from "./noautorizado.component";

const routes: Routes = [{
  path: '',
  component: NoAutorizadoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class NoAutorizadoRoutingModule { }
