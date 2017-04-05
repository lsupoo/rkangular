import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CargoComponent} from "./cargo.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HorarioDialogFormComponent } from "./horario.dialog.component";
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';

import { CargoService } from '../../+common/service/cargo.service';
import {HttpModule, JsonpModule} from "@angular/http";
import {ButtonsModule} from "@progress/kendo-angular-buttons";
import {UploadModule} from "@progress/kendo-angular-upload";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {SimpleNotificationsModule} from "angular2-notifications/lib/simple-notifications.module";
import {GrowlModule} from "primeng/components/growl/growl";
import {TextMaskModule} from "angular2-text-mask";

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
    GrowlModule,
      TextMaskModule
  ],
  declarations: [CargoComponent,HorarioDialogFormComponent],
  providers: [
        CargoService
    ],
  bootstrap: [CargoComponent]
})

export class CargoModule {}