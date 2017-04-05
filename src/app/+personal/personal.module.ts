import {NgModule} from "@angular/core";
import {personalRouting} from './personal.routing';
import {VerEmpleadoModule} from "./+ver-empleado/ver.empleado.module";
import {BusquedaEmpleadoModule} from "./+busqueda-empleado/busqueda.empleado.module";
import {EmpleadoService} from "../+common/service/empleado.service";
import {EmpleadoModule} from "./+empleado/empleado.module";
import {DarBajaModule} from "./+empleado-darBaja/empleado.darBaja.module";
//CARGO
import {CargoModule} from './+nuevo-cargo/cargo.module';
import {CargoService} from '../+common/service/cargo.service';
//Historia Laboral
import {HistoriaLaboralModule} from './+historiaLaboral/historiaLaboral.module';
import {HistoriaLaboralService} from '../+common/service/historialLaboral.service';
import {CargoEditModule} from './+edit-cargo/cargo-edit.module';
//Notification
import {HorarioEmpleadoModule} from "./+horario-empleado/horario.empleado.module";
import {AdministrarHorarioEmpleadoModule} from "./+administrar-horario-empleado/administrar.horario.empleado.module";
import {ContratoEmpleadoModule} from "./+contrato/contrato.empleado.module";
import {AdministrarContratoEmpleadoModule} from "./+administrar-contrato-empleado/administrar.contrato.empleado.module";

@NgModule({
  declarations: [
  ],
  imports: [
    personalRouting,
    BusquedaEmpleadoModule,
    VerEmpleadoModule,
    EmpleadoModule,
    DarBajaModule,
    CargoEditModule,
    HistoriaLaboralModule,
    CargoModule,
    HorarioEmpleadoModule,
    AdministrarHorarioEmpleadoModule,
    ContratoEmpleadoModule,
    AdministrarContratoEmpleadoModule
    
  ],
  providers: [
      EmpleadoService,
      CargoService,
      HistoriaLaboralService
  ],
})
export class PersonalModule {}