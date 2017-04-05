import {AuditingEntity} from "../auditingEntity";
/**
 * Created by javier.cuicapuza on 2/16/2017.
 */
export class TablaGeneral extends AuditingEntity{

    constructor(
        public idTablaGeneral?:number,
        public idEmpresa?:number,
        public grupo?:string,
        public codigo?:string,
        public nombre?:string,
        public estado?:string
    ) {
        super();
    }
}
