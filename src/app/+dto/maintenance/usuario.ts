import {AlertaSubscriptor} from "./alertaSubscriptor";
/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {AuditingEntity} from "../auditingEntity";
import {UsuarioRol} from "./usuarioRol";
import {RolResult} from "../rolResult";
import {Rol2} from "./rol2";
export class Usuario extends AuditingEntity{
    constructor(
        public idUsuarioReset?:number,
        public idUsuario?:number,
        public fechaInicio?:string,
        public fechaFin?:string,
        public userName?:string,
        public enlace?:string,
        public password?:string,
        public confirmpassword?:string,

        public idEmpleado?:number,
        public cuentaUsuario?:string,
        public nombreEmpleado?:string,
        public nombre?:string,
        public apellidoPaterno?:string,
        public apellidoMaterno?:string,
        public email?:string,
        public estado?:string,
        public usuarioRol: UsuarioRol[]=[],
        public allRol: Rol2[]=[]
    ){
        super();
    }
}