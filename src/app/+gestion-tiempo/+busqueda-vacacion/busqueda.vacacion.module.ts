import {BusquedaVacacionesComponent} from "./busqueda.vacacion.component"
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {GridModule} from "@progress/kendo-angular-grid";
import {DialogModule} from "@progress/kendo-angular-dialog";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {HttpModule, JsonpModule} from "@angular/http";
import {UploadModule} from "@progress/kendo-angular-upload";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import {Ng2CompleterModule} from "ng2-completer";
import {BusyModule} from "angular2-busy";
import {LayoutModule} from "@progress/kendo-angular-layout";
import {MotivoRechazoVacacionBusquedaComponent} from "./motivoRechazoVacacionDesdeBusqueda";
import {TextMaskModule} from "angular2-text-mask";
import {GrowlModule} from "primeng/components/growl/growl";
import {ConfirmModule} from "../../shared/confirm/confirm.module";

@NgModule({
    imports: [
        CommonModule,
        SmartadminValidationModule,
        DropDownsModule,
        SmartadminInputModule,
        GridModule,
        DialogModule,
        ConfirmModule,
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
        LayoutModule,
        TextMaskModule,
        GrowlModule
    ],
    declarations: [BusquedaVacacionesComponent,MotivoRechazoVacacionBusquedaComponent],
    bootstrap: [BusquedaVacacionesComponent],
    entryComponents: [BusquedaVacacionesComponent],
})
export class BusquedaVacacionesModule {

}