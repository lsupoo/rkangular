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
import {AdministrarHorarioComponent} from "./administrar.horario.component";
import {HorarioDiaDialogFormComponent} from "./horario.dia.dialog.component";
import {SimpleNotificationsModule} from "angular2-notifications/src/simple-notifications.module";
import {InputMaskModule, GrowlModule} from "primeng/primeng";

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
      InputMaskModule,
      GrowlModule

  ],
    declarations: [AdministrarHorarioComponent, HorarioDiaDialogFormComponent],
    bootstrap: [AdministrarHorarioComponent]
})
export class AdministrarHorarioModule {


}
