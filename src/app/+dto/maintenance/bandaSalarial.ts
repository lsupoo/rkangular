import {AuditingEntity} from "../auditingEntity";
export class BandaSalarial extends AuditingEntity{
  constructor(
      public idBandaSalarial?:number,
      public idCargo?: number,
      public idMoneda?: number,
      public limiteSuperior?: number,
      public limiteMedio?: number,
      public limiteInferior?: number,
      public nombreMoneda?:string,
      public inicioVigencia?:string,
      public finVigencia?:string
  ) {
    super();
  }
}