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

import {PermisoComponent} from "./permiso.component";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SimpleNotificationsModule} from "angular2-notifications/src/simple-notifications.module";
import {InputsModule} from "@progress/kendo-angular-inputs";
import {GrowlModule, CalendarModule,InputMaskModule} from 'primeng/primeng';
import {TextMaskModule} from "angular2-text-mask";
import {BlockUIModule} from "primeng/components/blockui/blockui";

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
      InputsModule,
      SimpleNotificationsModule,
      GrowlModule,
      CalendarModule,
      InputMaskModule,
      TextMaskModule,
      BlockUIModule

  ],
    declarations: [PermisoComponent],
    bootstrap: [PermisoComponent]
})
export class PermisoModule {


}
