import { Routes, RouterModule } from '@angular/router';
import {VerEmpleadoComponent} from "./ver.empleado.component";

export const verEmpleadoRoutes: Routes = [{
  path: '',
  component: VerEmpleadoComponent
}];

export const verEmpleadoRouting = RouterModule.forChild(verEmpleadoRoutes);

