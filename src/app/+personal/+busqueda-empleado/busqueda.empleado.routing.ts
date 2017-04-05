/**
 * Created by josediaz on 28/10/2016.
 */

import {Routes, RouterModule} from "@angular/router";
import {VerEmpleadoComponent} from "../+ver-empleado/ver.empleado.component";


export const busquedaEmpleadoRoutes: Routes = [
    {
        path: '',
        redirectTo: 'busquedaEmpleado',
        pathMatch: 'full'
    },
    {
        path: 'verEmpleado',
        component: VerEmpleadoComponent
    }
];

export const BusquedaEmpleadoRouting = RouterModule.forChild(busquedaEmpleadoRoutes);




