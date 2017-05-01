import {AuditingEntity} from "../auditingEntity";
/**
 * Created by javier.cuicapuza on 2/7/2017.
 */
export class Rol2 extends AuditingEntity{
    constructor(
        public idRol?: number,
        public nombre?:number,
        public descripcion?: string,
        public rolSistema?: boolean,
        public estado?:string

    ) {
        super();
    }
}