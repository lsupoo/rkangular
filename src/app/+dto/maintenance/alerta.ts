import {AlertaSubscriptor} from "./alertaSubscriptor";
/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {AuditingEntity} from "../auditingEntity";
export class Alerta extends AuditingEntity{
    constructor(
        public idAlerta?:number,
        public idEmpresa?:number,
        public codigo?:number,
        public codigoTipoAlerta?:string,
        public tipoAlerta?:string,
        public codigoTipoNotificacion?:string,
        public tipoNotificacion?:string,
        public asunto?:string,
        public cuerpo?:string,
        public alerta?:string,
        public codigoEstado?:string,
        public estado?:string,

        public idEmpleado?:number,
        public nombreEmpleado?:string,

        public jefeProyecto?:boolean,
        public jefeDepartamento?:boolean,
        public jefeUnidad?:boolean,
        public jefeEmpresa?:boolean,
        public subscriptores:AlertaSubscriptor[]=[]
    ){
        super();
    }
}