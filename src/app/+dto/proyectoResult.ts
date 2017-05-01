export class ProyectoResult {
  constructor(public idProyecto?: number,
    public codigo?: string,
    public nombre?:string,
    public nombreUnidadDeNegocio?: string,
    public nombreDepartamentoArea?: string,
    public nombreJefeProyecto?: string,
    public estado?:string,
    public empleados?: number,
    public fechaInicio?: string,
    public fechaFin?: string

  ) {}
}