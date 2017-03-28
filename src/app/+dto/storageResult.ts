import {DepartamentoAreaCombo} from "./departamentoAreaCombo";
import {Proyecto} from "./maintenance/proyecto";
import {TablaGeneralResult} from "./tablaGeneralResult";
import {UnidadDeNegocioCombo} from "./unidadDeNegocioCombo";
import {TipoLicencia} from "./maintenance/tipoLicencia";
import {Moneda} from "./maintenance/moneda";
import {CargoCombo} from "./cargoCombo";
/**
 * Created by javier.cuicapuza on 1/16/2017.
 */
export class StorageResult{

    constructor(
        public unidadDeNegocio:UnidadDeNegocioCombo[]=[],
        public departamentoArea:DepartamentoAreaCombo[]=[],
        public proyecto:Proyecto[]=[],
        public tablaGeneral:TablaGeneralResult[]=[],
        public tipoLicencia:TipoLicencia[]=[],
        public moneda:Moneda[]=[],
        public cargo:CargoCombo[]=[]
    ) { }



}