import {NgModule, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule,JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";

import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";

import {SimpleNotificationsModule} from "angular2-notifications";
import {ChartsModule} from "ng2-charts";
import {BusyModule} from "angular2-busy";
import {DashboardEmpleadoComponent} from "./principal.empleado.component";
import {GrowlModule} from "primeng/components/growl/growl";
import {TextMaskModule} from "angular2-text-mask";
import {LayoutModule} from "@progress/kendo-angular-layout";

@NgModule({
  imports: [
      CommonModule,
      SmartadminModule,
      ButtonsModule,
      HttpModule,
      JsonpModule,
      GridModule,
      DropDownsModule,
      DialogModule,
      UploadModule,
      FormsModule,
      ReactiveFormsModule,
      SmartadminInputModule,
      SmartadminValidationModule,
      JqueryUiModule,
      SimpleNotificationsModule,
      ChartsModule,
      BusyModule,
      GrowlModule,
      TextMaskModule,
      LayoutModule

  ],
    declarations: [DashboardEmpleadoComponent],
    bootstrap: [DashboardEmpleadoComponent]
})
export class DashboardEmpleadoModule {


}
