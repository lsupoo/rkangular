import {AuditingEntity} from "../auditingEntity";
/**
 * Created by javier.cuicapuza on 1/18/2017.
 */
export class UsuarioRol extends AuditingEntity{
    constructor(
        public idUsuarioRol?:number,
        public idUsuario?:number,
        public idRol?:number,
        public descripcion?: string
    ){
        super();
    }
}