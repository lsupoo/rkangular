/**
 * Created by javier.cuicapuza on 1/9/2017.
 */
export class PermisoEmpleadoResult{

    constructor(
        public idPermisoEmpleado?: number,
        public nombreEmpleado?: string,
        public motivo?: string,
        public razon?:string,
        public fecha?:string,
        public horaInicio?:string,
        public horaFin?:string,
        public horas?:number,
        public estado?:string,

        public idAtendidoPor?:number,
        public nombreJefeInmediato?:string
    ) { }


}