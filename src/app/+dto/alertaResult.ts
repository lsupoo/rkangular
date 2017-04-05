/**
 * Created by javier.cuicapuza on 1/9/2017.
 */
export class AlertaResult{

    constructor(
        public idAlerta?: number,
        public codigo?: string,
        public tipoAlerta?:string,
        public tipoNotificacion?:string,
        public estado?: string
    ) { }


}