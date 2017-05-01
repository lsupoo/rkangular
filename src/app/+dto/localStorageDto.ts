/**
 * Created by javier.cuicapuza on 12/6/2016.
 */

export class LocalStorageGlobal{

    constructor(
        public idEmpleado?: number,
        public idUsuario?: number,
        public rolName?: String,
        public mostrarBoton?: boolean,
        public mostrarBotonEmple?: boolean,
        public mostrarBotonRhna?: boolean,
        public mostrarBotonGeren?: boolean,
        public mostrarBotonAdmin?: boolean,
        public typeWrite?: boolean,
        public typeRead?: boolean
    ){ }
}