import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoriaLaboralComponent } from './historiaLaboral.component';
import { EditCargoComponent } from '../+edit-cargo/cargo-edit.component';

export const historiaLaboralRoutes: Routes = [
    {
        path: '',
        component: HistoriaLaboralComponent
    },
    {
        path: 'editarCargo',
        component: EditCargoComponent

    }
];

export const historiaLaboralRouting: ModuleWithProviders = RouterModule.forChild(historiaLaboralRoutes);