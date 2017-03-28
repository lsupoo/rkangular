import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {HttpModule, JsonpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonsModule} from "@progress/kendo-angular-buttons";
import {GridModule} from "@progress/kendo-angular-grid";
import {DialogModule} from "@progress/kendo-angular-dialog";
import {UploadModule} from "@progress/kendo-angular-upload";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {EmpleadoComponent} from "./empleado.component";
import {DocumentoDialogFormComponent} from "./documento.dialog.component";
import {EducacionDialogFormComponent} from "./educacion.dialog.component";
import {ExperienciaLaboralDialogFormComponent} from "./experienciaLaboral.dialog.component";
import {EquipoEntregadoDialogFormComponent} from "./equipoEntregado.dialog.component";
import {FotoFormComponent} from "./foto.form.component";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {SimpleNotificationsModule} from "angular2-notifications/src/simple-notifications.module";
import {GrowlModule} from "primeng/components/growl/growl";
import {BlockUIModule} from "primeng/components/blockui/blockui";
import {LayoutModule} from "@progress/kendo-angular-layout";
import {TabViewModule} from "primeng/components/tabview/tabview";
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
      JqueryUiModule,
      SimpleNotificationsModule,
      GrowlModule,
      BlockUIModule,
      LayoutModule,
      TabViewModule,
      TextMaskModule

  ],

  declarations: [EmpleadoComponent,DocumentoDialogFormComponent,EducacionDialogFormComponent,ExperienciaLaboralDialogFormComponent,EquipoEntregadoDialogFormComponent, FotoFormComponent],

    bootstrap: [EmpleadoComponent]
})
export class EmpleadoModule { }
