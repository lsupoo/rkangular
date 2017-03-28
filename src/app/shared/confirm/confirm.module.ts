

import {NgModule} from "@angular/core";
import {DialogModule} from "@progress/kendo-angular-dialog";
import {ConfirmDialogComponent} from "./confirmDialogBase";
import {CommonModule} from "@angular/common";


@NgModule({
  imports: [

      CommonModule,
    DialogModule],
  declarations: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent ],

})
export class ConfirmModule{}
