/**
 * Created by javier.cuicapuza on 2/10/2017.
 */
export class CalendarioResult {

    constructor(
        public idCalendario?: number,
        public fecha?: string,
        public nombre?: string,
        public descripcion?: string,
        public diaCompleto?: string,
        public horaInicio?: string,
        public horaFin?: string,
    ) { }



}