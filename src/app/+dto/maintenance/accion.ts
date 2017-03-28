/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {AuditingEntity} from "../auditingEntity";
export class Accion extends AuditingEntity{
    constructor(
        public idAccion?:number,
        public idModulo?:number,
        public nombre?:string,
        public etiqueta?:string,
        public tipoAccion?:string,
        public autorizacionDefecto?:boolean,
        public autorizacionDefectoString?:string,
        public editable?:boolean,
        public editableString?:string,
        public autorizado?:boolean

    ){
        super();
    }
}
