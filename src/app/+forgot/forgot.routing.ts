import {RouterModule, Routes} from "@angular/router";
import {ForgotPasswordComponent} from "./+password/password.component";

export const forgotRoutes: Routes = [

    {
        path: '',
        redirectTo: 'busquedaReporteMarcacion',
        pathMatch: 'full'
    },

    {
        path: 'password',
        component: ForgotPasswordComponent
    }
];
export const forgotRouting = RouterModule.forChild(forgotRoutes)