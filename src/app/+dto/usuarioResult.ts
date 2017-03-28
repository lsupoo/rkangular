/**
 * Created by javier.cuicapuza on 1/18/2017.
 */
export class UsuarioResult{

    constructor(
        public cuentaUsuario?: number,
        public nombre?: string,
        public apellidoPaterno?:string,
        public apellidoMaterno?:string,
        public email?:string,
        public esEmpleado?:string,
        public estado?: string
    ) { }


}