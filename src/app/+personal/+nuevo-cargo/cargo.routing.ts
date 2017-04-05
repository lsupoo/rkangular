import { Routes, RouterModule } from '@angular/router';
import {CargoComponent} from "./cargo.component";

export const cargoRoutes: Routes = [{
  path: '',
  component: CargoComponent
}];

export const cargoRouting = RouterModule.forChild(cargoRoutes);