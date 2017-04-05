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

import { verEmpleadoRouting } from './ver.empleado.routing';

import { VerEmpleadoComponent} from "./ver.empleado.component";
import {LayoutModule} from "@progress/kendo-angular-layout";

@NgModule({
  imports: [
      CommonModule,
      //verEmpleadoRouting,
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
      JqueryUiModule,
      LayoutModule

  ],
    declarations: [VerEmpleadoComponent],
    bootstrap: [VerEmpleadoComponent]
})
export class VerEmpleadoModule {


}
