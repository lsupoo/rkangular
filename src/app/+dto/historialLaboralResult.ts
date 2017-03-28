/**
 * Created by javier.cuicapuza on 3/15/2017.
 */

export class HistorialLaboralResult {

    constructor(
        public idHistorialLaboral?: number,
        public unidadNegocio?: string,
        public departamentoArea?: string,
        public proyecto?: string,
        public cargo?: string,
        public jefeInmediato?: string,
        public fechaInicio?: string,
        public fechaFin?: string

    ) {}

}