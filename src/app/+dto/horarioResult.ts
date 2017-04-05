export class HorarioResult {

  constructor(
      public idHorario?: number,
      public nombre?: string,
      public horasSemanal?: number,
      public nombreUnidadNegocio?:string,
      public nombreDepartamento?:string,
      public nombreProyecto?:string,

      public idProyecto?:number,
      public idEmpresa?:number,

      public nombreTipoHorario?:string,
      public estado?:string,

      public porDefecto:boolean=false,
      public nombrePorDefecto?:string,
      public diasSemana?:string,
      public nombreEstado?:string,
      public tipoHorario?:string
  ) { }



}