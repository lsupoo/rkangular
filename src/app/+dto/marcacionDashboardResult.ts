/**
 * Created by javier.cuicapuza on 1/11/2017.
 */
export class MarcacionDashboardResult {

    constructor(
        public codigoEmpleado?:string,
        public nombreCompletoEmpleado?:string,
        public fecha?:string,
        public horaIngresoHorario?:string,
        public horaIngreso?:string,
        public demoraEntrada?:number,
        public horaInicioAlmuerzo?:string,
        public horaFinAlmuerzo?:string,
        public demoraAlmuerzo?:number,
        public horaSalidaHorario?:string,
        public horaSalida?:string,
        public demoraSalida?:number

    ) { }



}