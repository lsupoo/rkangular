import {RouterModule, Routes} from "@angular/router";
import {BusquedaEmpleadoComponent} from "./+busqueda-empleado/busqueda.empleado.component";
import {VerEmpleadoComponent} from "./+ver-empleado/ver.empleado.component";
import {EmpleadoComponent} from "./+empleado/empleado.component";
import {DarbajaComponent} from "./+empleado-darBaja/empleado.darBaja.component";
import {CargoComponent} from './+nuevo-cargo/cargo.component';
import {HistoriaLaboralComponent} from './+historiaLaboral/historiaLaboral.component';
import {EditCargoComponent} from './+edit-cargo/cargo-edit.component';
import {HorarioEmpleadoComponent} from "./+horario-empleado/horario.empleado.component";
import {AdministrarHorarioEmpleadoComponent} from "./+administrar-horario-empleado/administrar.horario.empleado.component";
import {ContratoEmpleadoComponent} from "./+contrato/contrato.empleado.component";
import {AdministrarContratoEmpleadoComponent} from "./+administrar-contrato-empleado/administrar.contrato.empleado.component";

export const personalRoutes: Routes = [
  {
    path: '',
    redirectTo: 'busquedaEmpleado',
    pathMatch: 'full'
  },
  {
    path: 'busquedaEmpleado',
    component: BusquedaEmpleadoComponent
  },
  {
    path: 'verEmpleado',
    component: VerEmpleadoComponent
  },
  {
    path: 'empleado',
    component: EmpleadoComponent
  },
  {
    path: 'darDeBaja',
    component: DarbajaComponent
  },
  {
    path: 'historiaLaboral',
    component: HistoriaLaboralComponent
  },
  {
    path: 'editarCargo',
    component: EditCargoComponent
  },
  {
    path: 'nuevoCargo',
    component: CargoComponent
  },
  {
    path: 'horarioEmpleado',
    component: HorarioEmpleadoComponent
  },
  {
    path: 'administrarHorarioEmpleado',
    component: AdministrarHorarioEmpleadoComponent
  },
  {
    path: 'contratoEmpleado',
    component: ContratoEmpleadoComponent
  },
  {
    path: 'administrarContratoEmpleado',
    component: AdministrarContratoEmpleadoComponent
  }

];
export const personalRouting = RouterModule.forChild(personalRoutes)