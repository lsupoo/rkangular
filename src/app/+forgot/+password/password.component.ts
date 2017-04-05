import {Component, OnInit} from "@angular/core";
import {Usuario} from "../../+dto/maintenance/usuario";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {AuthenticationService} from "../../+auth/_services/authentication.service";
import {Router} from "@angular/router";
import {forgotRouting} from "../forgot.routing";
import {ResetService} from "../../+common/service/reset.service";

declare var $: any;

@Component({
    selector: 'forgot-password',
    templateUrl: 'password.component.html',
    providers: [ResetService]

})
export class ForgotPasswordComponent implements OnInit {
    usuario: Usuario = new Usuario();
    loading = false;

    model: any = {};

    errorMessage: string;
    public constructor(private route: Router,private resetService:ResetService
                       ) {
        // You need this small hack in order to catch application root view container ref


    }
    ngOnInit(){

    }

    sendMailPasswordRecovery(){
        //this.authenticationService.sendMailPasswordRecovery(this.usuario);
        this.sendMailPassword();
    }

    private sendMailPassword() {

        this.usuario.userName = this.model.username;

        this.resetService.sendMailPasswordRecovery(this.usuario).subscribe(
            data => {
                this.showMessageOk(data);
            },
            error => this.errorMessage = <any>error
        );

    }

    private showMessageOk(data: Usuario) {
        let usuario: Usuario = data;
        this.route.navigate(['/forgot/mensaje']);
    }

}