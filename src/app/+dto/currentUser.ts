import {AssignedRole} from "./assignedRole";
/**
 * Created by javier.cuicapuza on 12/6/2016.
 */

export class CurrentUser {

    constructor(public idEmpleado?: number,
                public idUsuario?: number,
                public cuentaUsuario?: string,
                public nombreCompleto?: string,
                public email?: string,
                public idEmpresa?: number,
                public foto?:string,
                public genero?:string,
                public build?:string,
                public revision?:string,
                public timestamp?:string,
                public assignedRoles:AssignedRole[]=[]
    ) {
    }

}