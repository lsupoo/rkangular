import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ModuloService} from "../../shared/layout/navigation/http-modulo-service";
import {Modulo} from "../../+dto/maintenance/modulo";
import {Observable} from "rxjs";
import {StorageService} from "../../+common/storageLocalValues/storage.service";
import {AuthenticationService} from "../+services/authentication.service";
import {CurrentUser} from "../../+dto/currentUser";
import {Response} from "@angular/http";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {AssignedRole} from "../../+dto/assignedRole";
import {AutorizacionFilter} from "../../+dto/autorizacionFilter";

declare var $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
    modulos: Array<Modulo>;
    currentUser: CurrentUser;
    private rolAsignado: Array<AssignedRole> = [];
    errorMessage: string;

    authorizationFilter: AutorizacionFilter = new AutorizacionFilter();

    constructor(
        private router: Router,
        private storageService: StorageService,
        private authenticationService: AuthenticationService, private moduloService: ModuloService, private empleadoService:EmpleadoService) {
    }

    ngOnInit() {
        this.resizeWindow();

        $(window).bind("load resize scroll", () => {
            this.resizeWindow();
        });

        $(document).ready(() => {
            this.resizeWindow();
        });
    }

    resizeWindow () {
        var navbarHeigh = 0;
        var wrapperHeigh = $('#content').height();

        if (navbarHeigh > wrapperHeigh) {
            $('#content').css("height", navbarHeigh + "px");
        }

        if (navbarHeigh < wrapperHeigh) {
            $('#content').css("height", $(window).height() + "px");
        }
    }

    onForgotPassword(){
        this.router.navigate(['forgot/password']);
    }



    login() {

        debugger;
        this.loading = true;

        const getPostOne$= Observable.timer(1000).mapTo(
            this.authenticationService.login(this.model.username, this.model.password)
                .subscribe( data => {

                        this.moduloService.getModulosPermitidos(this.model.username)
                            .subscribe( dataModulos => {
                                    this.modulos = dataModulos;
                                    localStorage.setItem("modulos", JSON.stringify(this.modulos));
                                },
                                error => {
                                    this.error = 'Usuario no tiene m&oacute;dulos asignados.';
                                    this.handleError(error);
                                    this.loading = false;
                                });
                    },
                    error => {
                        debugger;
                        this.error = error.json().message;;
                        this.handleError(error);
                        this.loading = false;
                    })
        );
        const getPostTwo$ = Observable.timer(1000).mapTo(
            this.authenticationService.authenticateUser(this.model.username)
                .subscribe( dataAuthenticate => {

                        this.currentUser = dataAuthenticate;

                        sessionStorage.setItem("authenticatedUser", JSON.stringify(this.currentUser));
                    },
                    error => {
                        this.error = 'Usuario o contraseña es incorrecto.';
                        this.handleError(error);
                        this.loading = false;
                    })
        );

        //omitir estos datos(dont delete)
        this.authorizationFilter.idUsuario = 23;
        this.authorizationFilter.codigoModulo = 'A001';
        debugger;
        const getPostThree$ = Observable.timer(1000).mapTo(
            this.storageService.retrieveComboLocalStorage(this.authorizationFilter).subscribe(
                data =>{
                    this.storageService.localStorageValuesCommons(data);
                },
                error => {
                    this.error = 'Contacta al administrador';
                    this.handleError(error);
                    this.loading = false;
                })
        );


        Observable.merge(getPostOne$,getPostTwo$,getPostThree$)
            .subscribe(res => {
                    this.navigateRolByDefault();
                }
            );

    }
    private navigateRolByDefault(){
        let rolByDefault;

        this.currentUser  = JSON.parse(sessionStorage.getItem("authenticatedUser") || '{}');
        var index;
        for(index=0;index<this.currentUser.assignedRoles.length;index++) {
            var r=this.currentUser.assignedRoles[index]
            if(r.assigned && r.roleName=='RHANA' && r.roleDefault == true){
                rolByDefault = r.roleName;
            }
            if(r.assigned && r.roleName=='EMPLE' && r.roleDefault == true){
                rolByDefault = r.roleName;
            }
            if(r.assigned && r.roleName=='GEREN' && r.roleDefault == true){
                rolByDefault = r.roleName;
            }
            if(r.assigned && r.roleName=='ADMIN' && r.roleDefault == true){
                rolByDefault = r.roleName;
            }
        }
        if(rolByDefault == 'RHANA'){
            this.router.navigate(['/dashboard/principalAnalistaRRHH']);
        }
        if(rolByDefault == 'EMPLE'){
            this.router.navigate(['/dashboard/principal']);
        }
        if(rolByDefault == 'GEREN'){
            this.router.navigate(['/dashboard/principalJefe']);
        }
        if(rolByDefault == 'ADMIN'){
            this.router.navigate(['/organizacion/busquedaEmpresa']);
        }

    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Error del Servidor');
    }
}

