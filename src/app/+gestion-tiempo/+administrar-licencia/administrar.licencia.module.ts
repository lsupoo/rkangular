import {NgModule, ModuleWithProviders} from '@angular/core';
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
import {PermisoService} from "../../+common/service/permiso.service";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {AdministrarLicenciaComponent} from "./administrar.licencia.component";
import {Ng2AutoCompleteModule} from "ng2-auto-complete";
import {Ng2CompleterModule} from "ng2-completer";
import {BusyModule} from "angular2-busy";
import {AdministrarLicenciaDocumentComponent} from "./administrar.licencia.edit.form";
import {InputMaskModule} from "primeng/primeng";
import {GrowlModule} from "primeng/components/growl/growl";
import {MotivoLicenciaRechazoComponent} from "./motivoLicenciaRechazo";

@NgModule({
  imports: [
      CommonModule,
      SmartadminValidationModule,
      DropDownsModule,
      SmartadminInputModule,
      GridModule,
      DialogModule,
      SmartadminModule,
      HttpModule,
      JsonpModule,
      UploadModule,
      ReactiveFormsModule,
      FormsModule,
      JqueryUiModule,
      Ng2AutoCompleteModule,
      Ng2CompleterModule,
      BusyModule,
      GrowlModule,
      InputMaskModule

  ],
    declarations: [AdministrarLicenciaComponent,AdministrarLicenciaDocumentComponent,MotivoLicenciaRechazoComponent],
    providers: [
        PermisoService
    ],
    bootstrap: [AdministrarLicenciaComponent]
})
export class AdministrarLicenciaModule {


}
