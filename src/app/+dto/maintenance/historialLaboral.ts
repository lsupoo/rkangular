import {HorarioEmpleado} from "./horarioEmpleado";
import {AuditingEntity} from "../auditingEntity";
export class HistorialLaboral extends AuditingEntity{

    constructor(public idHistorialLaboral?: number,
        public idUnidadDeNegocio?: number,
        public idDepartamentoArea?: number,
        public jefeInmediato?: string,
        public idJefeInmediato?: number,
        public salario?: number,
        public idProyecto?: number,
        public idCargo?: number,
        public descripcion?: string,
        public idMoneda?: number,
        public nombreMoneda?: string,
        public idEmpleado?: number,
        public fechaInicio?: string,
        public fechaFin?: string

    ) {
        super();
    }
}