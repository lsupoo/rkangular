import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NoUserComponent} from "./nouser.component";

const routes: Routes = [{
    path: '',
    component: NoUserComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class NoUserRoutingModule { }