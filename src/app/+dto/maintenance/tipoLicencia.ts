import {AuditingEntity} from "../auditingEntity";
export class TipoLicencia extends AuditingEntity {
    constructor(
        public idTipoLicencia?: number,
        public codigo?: string,
        public nombre?: string,
        public limiteMensual?: number,
        public limiteAnual?: number,
        public estado?: string,
        public activaParaESS?:boolean
    ){
        super();
    }
}