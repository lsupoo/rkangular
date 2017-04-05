import {PermisoEmpleado} from "./permisoEmpleado";
import {Compensacion} from "./compensacion";
import {HorasExtra} from "./horasExtra";
export class CompensacionDetalle {

     constructor(
         public compensacion: Compensacion = new Compensacion(),
         public permisosEmpleado: PermisoEmpleado[]=[],
         public horasExtras: HorasExtra[]=[]

     ) {
     }


}
