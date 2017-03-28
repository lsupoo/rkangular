/**
 * Created by javier.cuicapuza on 1/13/2017.
 */
import {RouterModule, Routes} from "@angular/router";
import {BusquedaRolesComponent} from "./+busqueda-roles/busqueda.roles.component";
import {BusquedaUsuariosComponent} from "./+busqueda-usuarios/busqueda.usuarios.component";
import {AdministrarUsuariosComponent} from "./+administrar-usuarios/administrar.usuarios.component";
import {BusquedaModuloComponent} from "./+busqueda-modulos/busqueda.modulo.component";
import {AdministrarModuloComponent} from "./administrar-modulos/administrar.modulo.component";
import {AdministrarRolesComponent} from "./+administrar-roles/administrar.roles.component";


export const seguridadRoutes: Routes = [

    {
        path: '',
        redirectTo: 'busquedaRoles',
        pathMatch: 'full'
    },
    {
        path: 'busquedaRoles',
        component: BusquedaRolesComponent
    },
    {
        path: 'busquedaUsuarios',
        component: BusquedaUsuariosComponent
    },
    {
        path: 'busquedaModulos',
        component: BusquedaModuloComponent
    },
    {
        path: 'administrarModulo',
        component: AdministrarModuloComponent
    },
    {
        path: 'administrarUsuarios',
        component: AdministrarUsuariosComponent
    },
    {
        path: 'administrarRoles',
        component: AdministrarRolesComponent
    }
];
export const seguridadRouting = RouterModule.forChild(seguridadRoutes)