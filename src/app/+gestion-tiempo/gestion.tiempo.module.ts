import {NgModule} from "@angular/core";
import {gestionTiempoRouting} from "./gestion.tiempo.routing";
import {BusquedaMarcacionModule} from "./+busqueda-marcacion/busqueda.marcacion.module";
import {EmpleadoService} from "../+common/service/empleado.service";
import {BusquedaHorarioModule} from "./+busqueda-horario/busqueda.horario.module";
import {AdministrarHorarioModule} from "./+administrar-horario/administrar.horario.module";
import {BusquedaLicenciaModule} from "./+busqueda-licencia/busqueda.licencia.module"
import {AdministrarLicenciaModule} from "./+administrar-licencia/administrar.licencia.module";
import {AdministrarMarcacionModule} from "./+administrar-marcacion/administrar.marcacion.module";
import {BusquedaPermisosModule} from "./+busqueda-permisos/busqueda.permisos.module";
import {AdministrarPermisoModule} from "./+administrar-permisos/administrar.permiso.module";
import {BusquedaVacacionesModule} from "./+busqueda-vacacion/busqueda.vacacion.module";
import {AdministrarVacacionesModule} from "./+administrar-vacacion/administrarVacaciones.module";
import {VacacionService} from "../+common/service/vacacion.service";
import {BusquedaHorasExtrasModule} from "./+busqueda-horas-extras/busqueda.horas.extras.module";
import {AdministrarHorasExtraModule} from "./+administrar-horas-extras/administrarHorasExtras.module";
import {HorasExtraService} from "../+common/service/horasExtra.service";
import {LicenciaService} from "../+common/service/licencia.service";
import {BusquedaCompensacionModule} from "./+busqueda-compensacion/busqueda.compensacion.module";
import {AdministrarCompensacionModule} from "./+administrar-compensacion/administrar.compensacion.module";
import {RecuperarHorasModule} from "./+recuperar-horas/recuperar.horas.module";
import {BusquedaPeriodoModule} from "./+busqueda-periodo/busqueda.periodo.module";
import {PeriodoEmpleadoService} from "../+common/service/periodoEmpleado.service";
import {PermisoService} from "../+common/service/permiso.service";
import {RegularizarVacacionModule} from "./+administrar-regularizar-vacacion/regularizar.vacacion.module";

@NgModule({
  declarations: [
  ],
  imports: [
    gestionTiempoRouting,
      BusquedaPermisosModule,
      BusquedaMarcacionModule,
      BusquedaHorarioModule,
      BusquedaVacacionesModule,
      BusquedaHorasExtrasModule,
      BusquedaCompensacionModule,
      AdministrarHorasExtraModule,
      AdministrarPermisoModule,
      AdministrarHorarioModule,
      BusquedaLicenciaModule,
      AdministrarLicenciaModule,
      AdministrarMarcacionModule,
      AdministrarVacacionesModule,
      AdministrarCompensacionModule,
      RecuperarHorasModule,
      BusquedaPeriodoModule,
      RegularizarVacacionModule

  ],
  providers: [
      EmpleadoService,
      VacacionService,
      HorasExtraService,
      LicenciaService,
      PeriodoEmpleadoService,
      PermisoService
  ],
})
export class GestionTiempoModule {}
