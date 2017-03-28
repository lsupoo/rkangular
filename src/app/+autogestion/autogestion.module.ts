import {NgModule} from "@angular/core";

import {autogestionRouting} from './autogestion.routing';
import {PermisoModule} from "./+solicitar-permiso/permiso.module";
import {PermisoService} from "../+common/service/permiso.service";
import {AgendarVacacionesModule} from "./+agendar-vacaciones/agendarVacaciones.module";
import {DatosPersonalesModule} from "./+datos-personales/datos.personales.module";
import {EmpleadoService} from "../+common/service/empleado.service";
import {SolicitarCorreccionModule} from "./+solicitar-correccion/solicitar.correccion.module";
import {SolicitarHorasExtraModule} from "./+solicitar-horas-extra/solicitarHorasExtras.module";
import {SolicitarLicenciaModule} from "./+solicitar-licencia/solicitar.licencia.module";
import {LicenciaService} from "../+common/service/licencia.service";

@NgModule({
  declarations: [
  ],
  imports: [
      autogestionRouting,
      PermisoModule,
      AgendarVacacionesModule,
      DatosPersonalesModule,
      SolicitarHorasExtraModule,
      SolicitarCorreccionModule,
      SolicitarLicenciaModule
  ],
  providers: [
    PermisoService,
    EmpleadoService,
    LicenciaService
  ],
})
export class AutogestionModule {}
