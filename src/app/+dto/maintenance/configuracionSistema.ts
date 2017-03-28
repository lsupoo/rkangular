import {AuditingEntity} from "../auditingEntity";
export class ConfiguracionSistema extends AuditingEntity {
    constructor(
        public idConfiguracionSistema?: number,
        public codigo?: string,
        public descripcion?: string,
        public valor?: string,
        public idEmpresa?: number
    ){
        super();
    }
}