/**
 * Created by javier.cuicapuza on 1/11/2017.
 */
export class PieChartDataResult{

    constructor(
        public nroEmpleadosMarcacionTiempo?:number,
        public nroEmpleadosMarcacionFueraTiempo?:number,
        public nroEmpleadosSinMarcacion?:number,
        public minutosTardanzaXdia?:number,
        public minutosTardanzaXmes?:number,

        public countIsVacacion?:number,
        public countIsLicencia?:number,
        public countIsInasistencia?:number,
        public countSinMarcacion?:number,
        public horasPendientesCompensar?: number,
        public isPersonalConfianza?: number
    ) { }


}