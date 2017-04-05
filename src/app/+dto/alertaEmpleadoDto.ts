/**
 * Created by javier.cuicapuza on 12/22/2016.
 */
export class AlertaEmpleadoDto{

    constructor(
        public idAlerta?: number,
        public idEmpleado?: number,
        public mensaje?: string,
        public estado?:string
    ){}
}