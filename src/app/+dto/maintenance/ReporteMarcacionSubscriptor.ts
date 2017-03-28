import {AuditingEntity} from "../auditingEntity";
/**
 * Created by javier.cuicapuza on 12/28/2016.
 */
export class ReporteMarcacionSubscriptor extends AuditingEntity{
    constructor(
        public idReporteMarcacionSubscriptor?:number,
        public idReporteMarcacion?:number,
        public idEmpleado?:number,
        public nombreEmpleado?:string
    ){
        super();
    }
}