/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {Component, OnInit, EventEmitter,Output} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {CompleterData, CompleterService} from "ng2-completer";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {CargoService} from "../../+common/service/cargo.service";
import {EnumRolEmpleado} from "../../+enums/enumRolEmpleado";
import {Alerta} from "../../+dto/maintenance/alerta";
import {AlertaSubscriptor} from "../../+dto/maintenance/alertaSubscriptor";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {StorageResult} from "../../+dto/storageResult";
import {Usuario} from "../../+dto/maintenance/usuario";
import {UsuarioRol} from "../../+dto/maintenance/usuarioRol";
import {UsuarioService} from "../../+common/service/usuario.service";
import {RolResult} from "../../+dto/rolResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {Http} from "@angular/http";
import {Rol2} from "../../+dto/maintenance/rol2";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;

@Component({
    selector: 'administrar-alertas',
    templateUrl: 'administrar.usuarios.component.html',
    providers: []
})
export class AdministrarUsuariosComponent extends ComponentBase implements OnInit {

    @Output() save: EventEmitter<any> = new EventEmitter();

    public estados:TablaGeneralResult[];
    public estadosSelect: TablaGeneralResult;
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo: null};
    private dataServiceEmpleado:CompleterData;
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    localhost:  String = environment.backend;
    port: String = environment.port;
    usuario: Usuario = new Usuario();
    usuarioRol: UsuarioRol = new UsuarioRol();

    private view: Array<Rol2>=[];
    private allRol:Rol2[];
    private rolSelect: Rol2 = new Rol2();

    allRoles: RolResult = new RolResult();
    public defaultItemAllRoles: RolResult = {idRol: null,descripcion: 'Todos',nombre: null, estado: null,rolSistema:null};
    public asociadoEmpleado:boolean = true;

    constructor(public backendService: BackendService,
                private empleadoService: EmpleadoService,
                private usuarioService: UsuarioService,
                private completerService: CompleterService,
                private location: Location) {
        super(backendService,'SE001');

        this.dataServiceEmpleado = completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');


        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editUsuarioResult');
        if(this.storeSessionFilter.isNew == false){
            this.obtenerUsuarioById(this.storeSessionFilter.idTableFilter);
        }else{
            this.usuario = new Usuario();
            this.getEstados();
            this.cargarComboRoles();
        }
    }

    private obtenerUsuarioById(idUsuario: any): void{

        this.usuarioService.obtenerUsuarioById(idUsuario).subscribe(
            data => this.showDetail(data),
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit() {

    }

    onRegresarBusquedaUsuarios(){
        this.location.back();
    }
    onGuardarUsuarios(){

        if(this.validarRequerido()){
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        if(this.validarRolRequerido()){
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'AÃ±adir un rol.'});
            return;
        }
        this.usuario.usuarioRol = this.view;
        this.usuarioService.guardarUsuario(this.usuario).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaUsuario(data);
                    }, 3000);
                }

            },
            error => {
                this.backendService.notification(this.msgs, error);
            }


        );
    }
    showDetail(data:Usuario){

        this.usuario = data;
        this.view = data.usuarioRol;

        this.getEstados();
        this.getComboRoles();
    }
    selectedChangeCheck(){
        if(this.asociadoEmpleado === true){
        }
    }
    navegarBusquedaUsuario(data:NotificacionResult){
        this.goBack();
    }
    private validarRequerido():boolean{

        let validacion = false;
        if(this.usuario.cuentaUsuario=== undefined || this.usuario.cuentaUsuario == null){
            $('#cuentaUsuario').addClass('invalid').removeClass('required');
            $('#cuentaUsuario').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.usuario.nombre=== undefined || this.usuario.nombre == null){
            $('#nombre').addClass('invalid').removeClass('required');
            $('#nombre').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.usuario.apellidoPaterno=== undefined || this.usuario.apellidoPaterno == null){
            $('#apellidoPaterno').addClass('invalid').removeClass('required');
            $('#apellidoPaterno').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.usuario.apellidoMaterno=== undefined || this.usuario.apellidoMaterno == null){
            $('#apellidoMaterno').addClass('invalid').removeClass('required');
            $('#apellidoMaterno').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.usuario.email=== undefined || this.usuario.email == null){
            $('#email').addClass('invalid').removeClass('required');
            $('#email').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.usuario.estado=== undefined || this.usuario.estado == null || this.estados === undefined || this.estados == null){
            $('#estado').addClass('invalid').removeClass('required');
            $('#estado').parent().addClass('state-error').removeClass('state-success');
            $('#estado').css('border','2px solid red');
            validacion = true;
        }
        /*if(this.usuario.allRol=== undefined || this.usuario.allRol == null
         || this.usuario.allRol.length == null || this.usuario.allRol.length<= 0){

         $('#roles').addClass('invalid').removeClass('required');
         $('#roles').parent().addClass('state-error').removeClass('state-success');
         $('#roles').css('border','2px solid red');
         validacion = true;
         }*/
        if(this.view === undefined || this.view == null || this.view.length <= 0){
            $('#roles').addClass('invalid').removeClass('required');
            $('#roles').parent().addClass('state-error').removeClass('state-success');
            $('#roles').css('border','2px solid red');
            validacion = true;
        }
        return validacion;
    }
    private validarRolRequerido():boolean{

        let validacion = false;
        if(this.view === undefined || this.view == null || this.view.length <= 0){
            validacion = true;
        }
        return validacion;
    }
    goBack(): void {
        this.location.back();
    }

    selectEmpleado(e){
        if(e !=null)
            this.usuario.idEmpleado = e.originalObject.idEmpleado;
        else
            this.usuario.idEmpleado = null;
    }
    public changeEstado(value): void {
        let estadoVal: any = value;
        this.usuario.estado = estadoVal;
        $('#estados').css('border','none');

    }

    onAgregarRol(e){
        e.preventDefault();

        this.save.emit(this.rolSelect);
        this.crearRol(this.rolSelect);
        this.usuarioRol.idRol = undefined;
    }
    public crearRol(dataV: Rol2): Observable<Rol2[]> {
        return this.fetch("create", dataV);
    }
    public onDelete(e: Rol2): void {
        const operation = this.eliminarRol(e);
    }
    public eliminarRol(data: Rol2): Observable<Rol2[]> {
        return this.fetch("destroy", data);
    }

    private fetch(action: string = "", data?: Rol2): Observable<Rol2[]>  {

        if(action=="create"){
            var rolEnt : Rol2 = (JSON.parse(JSON.stringify(data)));
            this.view.push(rolEnt);
        }else if(action=="update"){
            var indice = this.view.indexOf(data);
            if(indice>=0)
                this.view[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){

            var indice = this.view.indexOf(data);

            if(indice>=0)
                this.view.splice(indice, 1);

        }

        return Observable.of(this.view);
    }

    /* CARGAR COMBO*/
    private getEstados() {

        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Usuario.Estado' === grupo.grupo);
    }
    private getComboRoles(){
        this.allRol = this.usuario.allRol;
    }
    private cargarComboRoles(){
        this.usuarioService.cargarComboRol().subscribe(
            roles => this.allRol = roles,
            error =>  this.errorMessage = <any>error);
    }
}