/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
export class TipoLicenciaResult {

    constructor(
        public idTipoLicencia?:number,
        public codigo?: string,
        public nombre?: string,
        public limiteMensual?: number,
        public limiteAnual?:number,
        public estado?: string
    ) { }



}