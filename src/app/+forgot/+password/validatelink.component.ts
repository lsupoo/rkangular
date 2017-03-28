import {Component, OnInit} from "@angular/core";
import {Usuario} from "../../+dto/maintenance/usuario";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {AuthenticationService} from "../../+auth/_services/authentication.service";
import {Router} from "@angular/router";
import {forgotRouting} from "../forgot.routing";
import {ResetService} from "../../+common/service/reset.service";
import {NotificacionResult} from "../../+dto/notificacionResult";

declare var $: any;

@Component({
    selector: 'reset-validatelink',
    templateUrl: 'validatelink.component.html',
    providers: [ResetService]

})
export class ValidateLinkComponent implements OnInit {
    usuario: Usuario = new Usuario();
    loading = false;

    model: any = {};

    errorMessage: string;
    public constructor(private route: Router,private resetService:ResetService, private empleadoService: EmpleadoService
                       ) {
        // You need this small hack in order to catch application root view container ref


    }
    ngOnInit(){
        this.validateLink();
    }

    validateLink() {

        this.usuario.enlace = document.URL;

        this.resetService.validateLinkResetPassword(this.usuario).subscribe(
            data => {
                this.redirectResetPassword(data);
            },
            error => this.errorMessage = <any>error
        );
    }

    private redirectResetPassword(data: NotificacionResult) {
        let notificacion: NotificacionResult = data;

        if(notificacion.codigo==1) {
            this.empleadoService.storeSessionStorage('enlace',this.usuario.enlace);
            this.route.navigate(['/reset/password']);
        } else{
            this.route.navigate(['/reset/invalidLink']);
        }


    }

}