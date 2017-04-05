/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
export class VacacionResult{

    constructor(
        public idVacacion?: number,
        public nombreEmpleado?: string,
        public fechaInicio?: string,
        public fechaFin?: string,
        public diasCalendarios?: number,
        public diasHabiles?: number,
        public nombreJefeInmediato?:string,
        public estado?:string,
        public idPeriodoEmpleado?:number,
    ) { }


}