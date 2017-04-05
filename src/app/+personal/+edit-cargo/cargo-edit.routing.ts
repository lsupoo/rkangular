import { Routes, RouterModule } from '@angular/router';
import {EditCargoComponent} from "./cargo-edit.component";

export const cargoEditRoutes: Routes = [{
  path: '',
  component: EditCargoComponent
}];

export const cargoEditRouting = RouterModule.forChild(cargoEditRoutes);