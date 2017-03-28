import {RouterModule, Routes} from "@angular/router";
import {ReporteMarcacionComponent} from "./+busqueda-reporte-marcaciones/reporte.marcaciones.component";
import {AdministrarMarcacionesComponent} from "./+administrar-reporte-marcaciones/detalle.marcaciones.component";
import {BusquedaAlertasComponent} from "./+busqueda-alertas/busqueda.alertas.component";
import {AdministrarAlertasComponent} from "./+administrar-alertas/administrar.alertas.component";
import {BusquedaTiposLicenciasComponent} from "./+busqueda-tipos-licencias/busqueda.tiposlicencias.component";
import {AdministrarTiposLicenciasComponent} from "./+administrar-tipos-licencias/administrar.tiposlicencias.component";
import {BusquedaConfiguracionSistemaComponent} from "./+busqueda-configuracion-sistema/busqueda.configuracionsistema.component";
import {AdministrarConfiguracionSistemaComponent} from "./+administrar-configuracion-sistema/administrar.configuracionsistema.component";
import {BusquedaCodigosComponent} from "./+busqueda-codigos/busqueda.codigos.component";
import {AdministrarCodigosComponent} from "./+administrar-codigos/administrar.codigos.component";

export const mantenimientoRoutes: Routes = [

    {
        path: '',
        redirectTo: 'busquedaReporteMarcacion',
        pathMatch: 'full'
    },
    {
        path: 'busquedaReporteMarcaciones',
        component: ReporteMarcacionComponent
    },
    {
        path: 'administrarReporteMarcaciones',
        component: AdministrarMarcacionesComponent
    },
    {
        path: 'busquedaAlertas',
        component: BusquedaAlertasComponent
    },
    {
        path: 'administrarAlertas',
        component: AdministrarAlertasComponent
    },
    {
        path: 'busquedaTiposLicencias',
        component: BusquedaTiposLicenciasComponent
    },
    {
        path: 'administrarTiposLicencias',
        component: AdministrarTiposLicenciasComponent
    },
    {
        path: 'busquedaConfiguracionSistema',
        component: BusquedaConfiguracionSistemaComponent
    },
    {
        path: 'administrarConfiguracionSistema',
        component: AdministrarConfiguracionSistemaComponent
    },
    {
        path: 'busquedaCodigos',
        component: BusquedaCodigosComponent
    },
    {
        path: 'administrarCodigos',
        component: AdministrarCodigosComponent
    }
];
export const mantenimientoRouting = RouterModule.forChild(mantenimientoRoutes)
