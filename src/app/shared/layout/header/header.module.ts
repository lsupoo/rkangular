import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {PopoverModule} from "ng2-popover";
import {CollapseMenuComponent} from "./collapse-menu/collapse-menu.component";
import {RecentProjectsComponent} from "./recent-projects/recent-projects.component";
import {FullScreenComponent} from "./full-screen/full-screen.component";
import {ActivitiesComponent} from "./activities/activities.component";
import {ActivitiesMessageComponent} from "./activities/activities-message/activities-message.component";
import {ActivitiesNotificationComponent} from "./activities/activities-notification/activities-notification.component";
import {ActivitiesTaskComponent} from "./activities/activities-task/activities-task.component";
import {HeaderComponent} from "./header.component";
import {UtilsModule} from "../../utils/utils.module";
import {SpeechButtonComponent} from "./speech-button/speech-button.component";
import {I18nModule} from "../../i18n/i18n.module";
import {UserModule} from "../../user/user.module";
import {VoiceControlModule} from "../../voice-control/voice-control.module";
import {DropdownModule} from "ng2-bootstrap";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {EmpleadoComponent} from "./empleado.component";
import {DocumentoDialogFormComponent} from "./documento.dialog.component";
import {EducacionDialogFormComponent} from "./educacion.dialog.component";
import {ExperienciaLaboralDialogFormComponent} from "./experienciaLaboral.dialog.component";
import {EquipoEntregadoDialogFormComponent} from "./equipoEntregado.dialog.component";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {UploadModule} from "@progress/kendo-angular-upload";
import {DialogModule} from "@progress/kendo-angular-dialog";
import {FotoHeaderFormComponent} from "./foto-header.form.component";
import {GrowlModule} from "primeng/components/growl/growl";
import {PushNotificationsModule} from "angular2-notifications";

@NgModule({
    imports: [
        CommonModule,

        DialogModule,
        UploadModule,
        FormsModule,
        PushNotificationsModule,
        VoiceControlModule,
        DropdownModule,

        UtilsModule, I18nModule, UserModule, PopoverModule, GrowlModule
    ],
    declarations: [
        ActivitiesMessageComponent,
        ActivitiesNotificationComponent,
        ActivitiesTaskComponent,
        RecentProjectsComponent,
        FullScreenComponent,
        CollapseMenuComponent,
        ActivitiesComponent,
        HeaderComponent,
        SpeechButtonComponent,
        FotoHeaderFormComponent
    ],
    exports: [
        HeaderComponent
    ]
})
export class HeaderModule {
}
