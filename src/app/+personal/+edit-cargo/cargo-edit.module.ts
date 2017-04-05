import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule,JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UploadModule } from '@progress/kendo-angular-upload';

import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";

import {SimpleNotificationsModule} from "angular2-notifications";
import {EditCargoComponent} from "./cargo-edit.component";
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import {BusyModule} from "angular2-busy";
import {GrowlModule} from "primeng/components/growl/growl";
import {TextMaskModule} from "angular2-text-mask";
import {InputMaskModule} from "primeng/components/inputmask/inputmask";
import {CurrencyMaskModule} from "ng2-currency-mask";

@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    ButtonsModule,
    DropDownsModule,
    GridModule,
    DialogModule,
    HttpModule,
    JsonpModule,
    UploadModule,
    FormsModule,
    ReactiveFormsModule,
    SmartadminInputModule,
    JqueryUiModule,
    SimpleNotificationsModule,
    BusyModule,
    GrowlModule,
      TextMaskModule,
    InputMaskModule



  ],
  declarations: [EditCargoComponent],
  bootstrap: [EditCargoComponent]

})

export class CargoEditModule {}