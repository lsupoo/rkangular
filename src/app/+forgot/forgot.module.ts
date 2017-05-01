import {NgModule} from "@angular/core";
import {ForgotPasswordComponent} from "./+password/password.component";
import {forgotRouting} from "./forgot.routing";
import {EmpleadoService} from "../+common/service/empleado.service";
import {NotificationsService, SimpleNotificationsModule} from "angular2-notifications";


@NgModule({
    declarations: [
        ForgotPasswordComponent

    ],
    imports: [
        forgotRouting
    ],
    providers: [
        EmpleadoService, SimpleNotificationsModule

    ],
})
export class ForgotModule {}