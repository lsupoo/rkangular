/**
 * Created by javier.cuicapuza on 1/25/2017.
 */
import {RouterModule, Routes} from "@angular/router";
import {DashboardEmpleadoComponent} from "./principal-empleado/principal.empleado.component";
import {DashboardRRHHComponent} from "./principal-rrhh/principal.rrhh.component";
import {DashboardJefeComponent} from "./principal-jefe/principal.jefe.component";

export const dashboardRoutes: Routes = [
    {
        path: '',
        redirectTo: 'principal',
        pathMatch: 'full'
    },
    {
        path: 'principalAnalistaRRHH',
        component: DashboardRRHHComponent
    },
    {
        path: 'principal',
        component: DashboardEmpleadoComponent
    },
    {
        path: 'principalJefe',
        component: DashboardJefeComponent
    }
];

export const dashboardRouting = RouterModule.forChild(dashboardRoutes)
