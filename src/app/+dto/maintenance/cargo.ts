import {BandaSalarial} from "./bandaSalarial";
import {AuditingEntity} from "../auditingEntity";
export class Cargo extends AuditingEntity{
  constructor(
    public idCargo?: number,
    public idEmpresa?: number,
    public idUnidadDeNegocio?: number,
    public idDepartamentoArea?: number,
    public idSuperior?: number,
    public nombre?: string,
    public descripcion?: string,
    public fechaInicio?: string,
    public fechaFin?: string,
    public salario?: number,
    public idMoneda?: number,
    public idProyecto?: number,
    public horasSemanal?: number,
    public nombreDepartamento?:string,
    public nombreUnidadNegocio?:string,
    public nombreProyecto?:string,
    public nombreCargoSuperior?:string,
    public estado?:string,
    public nombreEstado?:string,
    public bandasSalariales:BandaSalarial[]=[]

  ) {
    super();
  }
}