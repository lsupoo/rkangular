import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {DialogModule} from "@progress/kendo-angular-dialog";
import {GridModule} from "@progress/kendo-angular-grid";
import {UploadModule} from "@progress/kendo-angular-upload";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
//import {GridEditFormComponent} from "./grid.edit.empleados.component";
import {JsonpModule, HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
//import {VerEmpleadoModule} from "../+ver-empleado/ver.empleado.module";
//import {EmpleadoModule} from "../+empleado/empleado.module";
import {Ng2CompleterModule} from "ng2-completer";
import {BusyModule} from "angular2-busy";
import {BusquedaEmpresaComponent} from "./busqueda.empresa.component";
import {LayoutModule} from "@progress/kendo-angular-layout";
import {GrowlModule} from "primeng/components/growl/growl";

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
        Ng2CompleterModule,
        BusyModule,
        LayoutModule,
        GrowlModule
    ],
    declarations: [BusquedaEmpresaComponent],
    bootstrap: [BusquedaEmpresaComponent]
})
export class BusquedaEmpresaModule {

}
