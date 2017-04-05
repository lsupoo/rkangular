import {RouterModule, Routes} from "@angular/router";
import {BusquedaMarcacionComponent} from "./+busqueda-marcacion/busqueda.marcacion.component";
import {BusquedaHorarioComponent} from "./+busqueda-horario/busqueda.horario.component";
import {AdministrarHorarioComponent} from "./+administrar-horario/administrar.horario.component";
import {BusquedaLicenciaComponent} from "./+busqueda-licencia/busqueda.licencia.component";
import {AdministrarLicenciaComponent} from "./+administrar-licencia/administrar.licencia.component";
import {AdministrarMarcacionComponent} from "./+administrar-marcacion/administrar.marcacion.component";
import {BusquedaPermisosComponent} from "./+busqueda-permisos/busqueda.permisos.component";
import {AdministrarPermisoComponent} from "./+administrar-permisos/administrar.permiso.component";
import {BusquedaVacacionesComponent} from "./+busqueda-vacacion/busqueda.vacacion.component";
import {AdministrarVacacionesComponent} from "./+administrar-vacacion/administrarVacaciones.component";
import {BusquedaHorasExtrasComponent} from "./+busqueda-horas-extras/busqueda.horas.extras.component";
import {AdministrarHorasExtraComponent} from "./+administrar-horas-extras/administrarHorasExtras.component";
import {BusquedaCompensacionComponent} from "./+busqueda-compensacion/busqueda.compensacion.component";
import {AdministrarCompensacionComponent} from "./+administrar-compensacion/administrar.compensacion.component";
import {RecuperarHorasComponent} from "./+recuperar-horas/recuperar.horas.component";
import {BusquedaPeriodoComponent} from "./+busqueda-periodo/busqueda.periodo.component";
import {RegularizarVacacionComponent} from "./+administrar-regularizar-vacacion/regularizar.vacacion.component";

export const gestionTiempoRoutes: Routes = [
  {
    path: '',
    redirectTo: 'busquedaMarcacion',
    pathMatch: 'full'
  },
  {
    path: 'busquedaPermisos',
    component: BusquedaPermisosComponent
  },
  {
    path: 'busquedaMarcaciones',
    component: BusquedaMarcacionComponent
  },
  {
    path: 'busquedaHorarios',
    component: BusquedaHorarioComponent
  },
  {
    path: 'busquedaVacaciones',
    component: BusquedaVacacionesComponent
  },
  {
    path: 'busquedaHorasExtras',
    component: BusquedaHorasExtrasComponent
  },
  {
    path: 'busquedaCompensacion',
    component: BusquedaCompensacionComponent
  },
  {
    path: 'busquedaPeriodo',
    component: BusquedaPeriodoComponent
  },
  {
    path: 'administrarHorasExtra',
    component: AdministrarHorasExtraComponent
  },
  {
    path: 'administrarPermiso',
    component: AdministrarPermisoComponent
  },
  {
    path: 'administrarVacaciones',
    component: AdministrarVacacionesComponent
  },
  {
    path: 'regularizarVacaciones',
    component: RegularizarVacacionComponent
  },
  {
    path: 'administrarHorario',
    component: AdministrarHorarioComponent
  },
  {
    path: 'busquedaLicencias',
    component: BusquedaLicenciaComponent
  },
  {
    path: 'administrarLicencias',
    component: AdministrarLicenciaComponent
  },
  {
    path: 'administrarMarcacion',
    component: AdministrarMarcacionComponent
  },
  {
    path: 'administrarCompensacion',
    component: AdministrarCompensacionComponent
  },
  {
    path: 'recuperarHoras',
    component: RecuperarHorasComponent
  }


];
export const gestionTiempoRouting = RouterModule.forChild(gestionTiempoRoutes)
