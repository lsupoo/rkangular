import {dashboardRouting} from "./dashboard.routing";
import {NgModule} from "@angular/core";
import {EmpleadoService} from "../+common/service/empleado.service";
import {DashBoardService} from "../+common/service/dashboard.service";
import {DashboardRRHHModule} from "./principal-rrhh/principal.rrhh.module";
import {DashboardEmpleadoModule} from "./principal-empleado/principal.empleado.module";
import {DashboardJefeModule} from "./principal-jefe/principal.jefe.module";
import {PermisoService} from "../+common/service/permiso.service";
/**
 * Created by javier.cuicapuza on 1/25/2017.
 */
@NgModule({
    declarations: [
    ],
    imports: [
        dashboardRouting,
        DashboardRRHHModule,
        DashboardEmpleadoModule,
        DashboardJefeModule
    ],
    providers: [EmpleadoService,DashBoardService,PermisoService
    ],
})
export class DashboardModule {}
