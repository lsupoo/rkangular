export class CargoResult{
  constructor(
    public idCargo?: number,
    public nombre?: string,
    public nombreDepartamento?:string,
    public nombreUnidadNegocio?:string,
    public nombreProyecto?:string,
    public nombreCargoSuperior?:string,
    public estado?:string

  ) {
  }
}