import {RouterModule, Routes} from "@angular/router";
import {BusquedaProyectoComponent} from "./+busqueda-proyecto/busqueda.Proyecto.component";
import {BusquedaCargoComponent} from "./+busqueda-cargo/busqueda.cargo.component";
import {AdministrarCargoComponent} from "./+administrar-cargo/administrar.cargo.component";
import {AdministrarProyectoComponent} from "./+administrar-proyecto/administrar.proyecto.component";
import {BusquedaCentroCostoComponent} from "./+busqueda-centro-costo/busqueda.centrocosto.component";
import {AdministrarCentroCostoComponent} from "./+administrar-centrocosto/administrar.centrocosto.component";
import {AdministrarEmpresaComponent} from "./+administrar-empresa/administrar.empresa.component";
import {BusquedaEmpresaComponent} from "./+busqueda-empresa/busqueda.empresa.component";
import {AdministrarCalendarioComponent} from "./+administrar-calendario/administrar.calendario.component";
import {BusquedaCalendarioComponent} from "./+busqueda-calendario/busqueda.calendario.component";

export const organizacionRoutes: Routes = [
  {
    path: '',
    redirectTo: 'busquedaEmpresa',
    pathMatch: 'full'
  },
  {
    path: 'busquedaProyecto',
    component: BusquedaProyectoComponent
  },
  {
    path: 'busquedaCargo',
    component: BusquedaCargoComponent
  },
  {
    path: 'busquedaCentroCosto',
    component: BusquedaCentroCostoComponent
  },
  {
    path: 'busquedaEmpresa',
    component: BusquedaEmpresaComponent
  },
  {
    path: 'busquedaCalendario',
    component: BusquedaCalendarioComponent
  },
  {
    path: 'administrarCargo',
    component: AdministrarCargoComponent
  },
  {
    path: 'administrarProyecto',
    component: AdministrarProyectoComponent
  },
  {
    path: 'administrarCentroCosto',
    component: AdministrarCentroCostoComponent
  },
  {
    path: 'administrarEmpresa',
    component: AdministrarEmpresaComponent
  },
  {
    path: 'administrarCalendario',
    component: AdministrarCalendarioComponent
  }
];

export const organizacionRouting = RouterModule.forChild(organizacionRoutes)