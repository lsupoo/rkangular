import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {historiaLaboralRouting} from "./historiaLaboral.routing";
import {HistoriaLaboralComponent} from "./historiaLaboral.component";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
import {DialogModule} from "@progress/kendo-angular-dialog";
import {GridModule} from "@progress/kendo-angular-grid";
import {ButtonsModule} from "@progress/kendo-angular-buttons";
import {HistoriaLaboralService} from "../../+common/service/historialLaboral.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {CargoEditModule} from "../+edit-cargo/cargo-edit.module";
import {GrowlModule} from "primeng/components/growl/growl";
import {BusyModule} from "angular2-busy";

@NgModule({
  imports: [
    CommonModule,
    SmartadminValidationModule,
    DropDownsModule,
    SmartadminInputModule,
    historiaLaboralRouting,
    GridModule,
    DialogModule,
    ButtonsModule,
    SmartadminModule,
    ReactiveFormsModule,
    FormsModule,
    JqueryUiModule,
    CargoEditModule,
    GrowlModule,
    BusyModule
  ],
  declarations: [HistoriaLaboralComponent],
  providers: [
        HistoriaLaboralService
    ],
  bootstrap: [HistoriaLaboralComponent],
  entryComponents: [HistoriaLaboralComponent],
})

export class HistoriaLaboralModule {}