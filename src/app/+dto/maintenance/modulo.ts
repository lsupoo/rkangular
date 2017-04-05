import {AuditingEntity} from "../auditingEntity";
import {Accion} from "./accion";
/**
 * Created by josediaz on 25/11/2016.
 */

export class Modulo extends AuditingEntity{

    constructor(public nombre?: string,
                url?: string,
                codigo?: string,
                tipoPermiso?: string,
                visible?: string,
                subModulos?: Array<Modulo>,
                acciones?: Array<Accion>,
                imageClass?:string
    ) {
        super();
    }
}
