/**
 * Created by javier.cuicapuza on 1/9/2017.
 */
export class ReporteMarcacionResult{

    constructor(
        public idReporteMarcacion?: number,
        public nombreUnidadNegocio?: string,
        public nombreDepartamento?:string,
        public nombreProyecto?:string,
        public jefeInmediato?: string,
        public estado?: string
    ) { }


}