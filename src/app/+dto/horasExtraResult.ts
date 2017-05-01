/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
export class HorasExtraResult {

    constructor(
        public idHorasExtra?:number,
        public nombreJefeInmediato?: string,
        public nombreEmpleado?: string,
        public fecha?: string,
        public horas?:string,
        public estado?: string,
        public horaSalidaHorario?: string,
        public horaSalidaSolicitado?: string,
        public horasNoCompensables?: number
    ) { }



}