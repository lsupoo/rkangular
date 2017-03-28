/**
 * Created by javier.cuicapuza on 3/14/2017.
 */

export class IndicadorRRHHResultViewModel {

    constructor(
        public countEmpleadoVacacionHoy?:number,
        public countTardanzasxDia?:number,
        public countBirthdayByMonth?:number,
        public countAltasLastYear?:number,
        public countEmpleadoEmpresa?:number,
        public countContratoxVencer?:number,
        public countEmpleadoLicenciaByDay?:number,
        public countInasistenciasxMes?:number,
        public countLicenciaxMes?:number,
        public countBajasLastYear?:number,
        public countTardanzasPromedioAlDiaxMes?:number
    ) { }

}