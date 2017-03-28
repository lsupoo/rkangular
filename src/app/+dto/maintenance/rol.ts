import {AuditingEntity} from "../auditingEntity";
import {Accion} from "./accion";
import {Modulo} from "./modulo";
/**
 * Created by javier.cuicapuza on 2/1/2017.
 */
export class Rol extends AuditingEntity{
    constructor(
                public idRol?: number,
                public nombre?:number,
                public descripcion?: string,
                public rolSistema?: boolean,
                public estado?:string,
                public modulo:Modulo[]=[]
                //public accion:Accion[]=[]

    ) {
        super();
    }
}