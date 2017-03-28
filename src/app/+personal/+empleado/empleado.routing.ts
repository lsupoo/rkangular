import { Routes, RouterModule } from '@angular/router';
import {EmpleadoComponent} from "./empleado.component";

export const empleadoRoutes: Routes = [{
  path: '',
  component: EmpleadoComponent
}];

export const empleadoRouting = RouterModule.forChild(empleadoRoutes);

