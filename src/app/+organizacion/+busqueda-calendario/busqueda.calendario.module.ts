import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule,JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {BusquedaCalendarioComponent} from "./busqueda.calendario.component";
//import {CalendarioEditDialogFormComponent} from "./calendario.edit.dialog.component";
import {BusyModule} from "angular2-busy";
import {GrowlModule} from "primeng/components/growl/growl";
import {ConfirmModule} from "../../shared/confirm/confirm.module";
import {LayoutModule} from "@progress/kendo-angular-layout";

@NgModule({
  imports: [
      CommonModule,
      SmartadminValidationModule,
      DropDownsModule,
      SmartadminInputModule,
      GridModule,
      DialogModule,
      SmartadminModule,
      JsonpModule,
      UploadModule,
      ReactiveFormsModule,
      FormsModule,
      JqueryUiModule,
      HttpModule,
      BusyModule,
      GrowlModule,
      ConfirmModule,
      LayoutModule

  ],
    declarations: [BusquedaCalendarioComponent],
    bootstrap: [BusquedaCalendarioComponent]
})
export class BusquedaCalendarioModule {


}
