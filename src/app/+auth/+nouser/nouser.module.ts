import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoUserRoutingModule } from './nouser-routing.module';
import { NoUserComponent } from './nouser.component';

@NgModule({
    imports: [
        CommonModule,
        NoUserRoutingModule
    ],
    declarations: [NoUserComponent]
})
export class NoUserModule { }