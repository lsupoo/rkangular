import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {GridModule} from "@progress/kendo-angular-grid";
import {UploadModule} from "@progress/kendo-angular-upload";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
import {JsonpModule, HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {Ng2CompleterModule} from "ng2-completer";
import {BusyModule} from "angular2-busy";
import {BusquedaProyectoComponent} from "./busqueda.Proyecto.component";
import {LayoutModule} from "@progress/kendo-angular-layout";
import {GrowlModule} from "primeng/primeng";
import {TextMaskModule} from "angular2-text-mask";
import {ConfirmModule} from "../../shared/confirm/confirm.module";
import {DialogModule} from "@progress/kendo-angular-dialog";

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
        Ng2CompleterModule,
        BusyModule,
        LayoutModule,
        GrowlModule,
        TextMaskModule,

    ],
    declarations: [BusquedaProyectoComponent],
    bootstrap: [BusquedaProyectoComponent],
    entryComponents: [BusquedaProyectoComponent],
})
export class BusquedaProyectoModule {

}
