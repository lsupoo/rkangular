import {NgModule} from "@angular/core";
import {mantenimientoRouting} from "./mantenimiento.routing";
import {EmpleadoService} from "../+common/service/empleado.service";
import {ReporteMarcacionModule} from "./+busqueda-reporte-marcaciones/reporte.marcaciones.module";
import {AdministrarMarcacionesModule} from "./+administrar-reporte-marcaciones/detalle.marcaciones.module";
import {BusquedaAlertasModule} from "./+busqueda-alertas/busqueda.alertas.module";
import {AdministrarAlertasModule} from "./+administrar-alertas/administrar.alertas.module";
import {BusquedaTiposLicenciasModule} from "./+busqueda-tipos-licencias/busqueda.tiposlicencias.module";
import {AdministrarTiposLicenciasModule} from "./+administrar-tipos-licencias/administrar.tiposlicencias.module";
import {BusquedaConfiguracionSistemaModule} from "./+busqueda-configuracion-sistema/busqueda.configuracionsistema.module";
import {AdministrarConfiguracionSistemaModule} from "./+administrar-configuracion-sistema/administrar.configuracionsistema.module";
import {BusquedaCodigosModule} from "./+busqueda-codigos/busqueda.codigos.module";
import {TablaGeneralService} from "../+common/service/tablaGeneral.service";
import {AdministrarCodigosModule} from "./+administrar-codigos/administrar.codigos.module";

@NgModule({
    declarations: [
    ],
    imports: [
        mantenimientoRouting,
        ReporteMarcacionModule,
        AdministrarMarcacionesModule,
        BusquedaAlertasModule,
        BusquedaCodigosModule,
        AdministrarAlertasModule,
        BusquedaTiposLicenciasModule,
        AdministrarTiposLicenciasModule,
        BusquedaConfiguracionSistemaModule,
        AdministrarConfiguracionSistemaModule,
        AdministrarCodigosModule
    ],
    providers: [
        EmpleadoService,TablaGeneralService
    ],
})
export class MantenimientoModule {}
