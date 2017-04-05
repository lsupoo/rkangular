import {Component, OnInit} from "@angular/core";
import {Usuario} from "../../+dto/maintenance/usuario";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {AuthenticationService} from "../../+auth/_services/authentication.service";
import {Router} from "@angular/router";
import {forgotRouting} from "../forgot.routing";
import {ResetService} from "../../+common/service/reset.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {NotificationsService, SimpleNotificationsModule} from "angular2-notifications";
import {isUndefined} from "util";
import {ResetPasswordFilter} from "../../+dto/ResetPasswordFilter";

declare var $: any;

@Component({
    selector: 'reset-password',
    templateUrl: 'resetpassword.component.html',
    providers: [ResetService,NotificationsService]

})
export class ResetPasswordComponent implements OnInit {
    usuario: Usuario = new Usuario();
    loading = false;

    model: ResetPasswordFilter=new ResetPasswordFilter();

    errorMessage: string;

    public options = {
        timeOut: 2500,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'top']
    };

    public constructor(private route: Router,private resetService:ResetService,
                       private empleadoService:EmpleadoService, private _service: NotificationsService
                       ) {
        // You need this small hack in order to catch application root view container ref


    }
    ngOnInit(){

    }
    resetpassword() {
        this.usuario.password= this.model.password;
        this.usuario.confirmpassword=this.model.confirmPassword;
        this.usuario.enlace=this.empleadoService.retrieveSessionStorage('enlace');

        if(this.usuario.password==undefined || this.usuario.confirmpassword== undefined ||
            this.usuario.password==null|| this.usuario.confirmpassword== null  ||
            this.usuario.password!=this.usuario.confirmpassword){
            this._service.error("Error", 'Los valores de contraseña son distintos');
            return;
        } else {

            this.resetService.resetPassword(this.usuario).subscribe(
                data => {
                    this.showMessageOk(data);
                },
                error => this.errorMessage = <any>error
            );
        }
    }

    private showMessageOk(data: NotificacionResult) {
        let notificacion: NotificacionResult = data;
        this.route.navigate(['/reset/passwordMessage']);
    }

}