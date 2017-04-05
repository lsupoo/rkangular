import {ReporteMarcacionSubscriptor} from "./ReporteMarcacionSubscriptor";
import {AuditingEntity} from "../auditingEntity";
/**
 * Created by javier.cuicapuza on 12/28/2016.
 */
export class ReporteMarcacion extends AuditingEntity{
    constructor(
        public idReporteMarcacion?:number,
        public idUnidadDeNegocio?:number,
        public idDepartamentoArea?:number,
        public idEmpresa?:number,
        public idProyecto?:number,
        public idEmpleado?:number,
        public nombreEmpleado?:string,
        public idJefe?:number,
        public jefeInmediato?:string,
        public reporteDiario?:boolean,
        public reporteAcumulado?:boolean,
        public estado?:string,
        public subscriptores:ReporteMarcacionSubscriptor[]=[]
    ){
        super();
    }
}