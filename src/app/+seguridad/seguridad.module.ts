/**
 * Created by javier.cuicapuza on 1/13/2017.
 */
import {NgModule} from "@angular/core";
import {seguridadRouting} from "./seguridad.routing";
import {EmpleadoService} from "../+common/service/empleado.service";
import {BusquedaRolesModule} from "./+busqueda-roles/busqueda.roles.module";
import {RolService} from "../+common/service/rol.service";
import {BusquedaUsuariosModule} from "./+busqueda-usuarios/busqueda.usuarios.module";
import {UsuarioService} from "../+common/service/usuario.service";
import {AdministrarUsuariosModule} from "./+administrar-usuarios/administrar.usuarios.module";
import {BusquedaModuloModule} from "./+busqueda-modulos/busqueda.modulo.module";
import {AdministrarModuloModule} from "./administrar-modulos/administrar.modulo.module";
import {AdministrarRolesModule} from "./+administrar-roles/administrar.roles.module";

@NgModule({
    declarations: [
    ],
    imports: [
        seguridadRouting,
        BusquedaRolesModule,
        BusquedaUsuariosModule,
        BusquedaModuloModule,
        AdministrarUsuariosModule,
        AdministrarModuloModule,
        AdministrarRolesModule
    ],
    providers: [
        EmpleadoService,RolService,UsuarioService
    ],
})
export class SeguridadModule {}