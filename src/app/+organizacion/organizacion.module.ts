import {NgModule} from "@angular/core";

import {EmpleadoService} from "../+common/service/empleado.service";
import {organizacionRouting} from "./organizacion.routing";
import {BusquedaProyectoModule} from "./+busqueda-proyecto/busqueda.proyecto.module";
import {BusquedaCargoModule} from "./+busqueda-cargo/busqueda.cargo.module";
import {AdministrarCargoModule} from "./+administrar-cargo/administrar.cargo.module";
import {AdministrarProyectoModule} from "./+administrar-proyecto/administrar.proyecto.module";
import {BusquedaCentroCostoModule} from "./+busqueda-centro-costo/busqueda.centrocosto.module";
import {CentroCostoService} from "../+common/service/centrocosto.service";
import {AdministrarCentroCostoModule} from "./+administrar-centrocosto/administrar.centrocosto.module";
import {AdministrarEmpresaModule} from "./+administrar-empresa/administrar.empresa.module";
import {BusquedaEmpresaModule} from "./+busqueda-empresa/busqueda.empresa.module";
import {AdministrarCalendarioModule} from "./+administrar-calendario/administrar.calendario.module";
import {CalendarioService} from "../+common/service/calendario.service";
import {BusquedaCalendarioModule} from "./+busqueda-calendario/busqueda.calendario.module";

@NgModule({
  declarations: [
  ],
  imports: [
      organizacionRouting,
      BusquedaProyectoModule,
      BusquedaCargoModule,
      BusquedaCentroCostoModule,
      BusquedaEmpresaModule,
      BusquedaCalendarioModule,
      AdministrarCentroCostoModule,
      AdministrarCargoModule,
      AdministrarProyectoModule,
      AdministrarEmpresaModule,
      AdministrarCalendarioModule
  ],
  providers: [
    EmpleadoService,CentroCostoService,CalendarioService
  ],
})
export class OrganizacionModule {}
