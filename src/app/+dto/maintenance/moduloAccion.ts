import {AuditingEntity} from "../auditingEntity";
import {Accion} from "./accion";
/**
 * Created by josediaz on 25/11/2016.
 */

export class ModuloAccion extends AuditingEntity{

    constructor(public idModulo?: number,
                public idParent?: number,
                public codigo?: string,
                public helpUrl?: string,
                public etiquetaMenu?:string,
                public orden?:number,
                public nombre?:string,
                public url?: string,
                public visible?: string,
                public acciones?: Array<Accion>
    ) {
        super();
    }
}

