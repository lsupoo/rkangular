/**
 * Created by griga on 7/11/16.
 */


import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {ModuleWithProviders} from "@angular/core";
import {AuthGuard} from "./+auth/+guards/auth.guards";
import {LoginComponent} from "./+auth/+login/login.component";
import {ForgotPasswordComponent} from "./+forgot/+password/password.component";
import {MensajeRecPasswordComponent} from "./+forgot/+password/mensaje.component";
import {ValidateLinkComponent} from "./+forgot/+password/validatelink.component";
import {InvalidLinkComponent} from "./+forgot/+password/invalidlink.component";
import {ResetPasswordComponent} from "./+forgot/+password/resetpassword.component";
import {ResetPasswordMessageComponent} from "./+forgot/+password/mensajeresetpassword.component";
import {NoAutorizadoComponent} from "./+auth/+noautorizado/noautorizado.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'noautorizado', component: NoAutorizadoComponent },
  {path: 'forgot/password', component: ForgotPasswordComponent},
  {path: 'forgot/mensaje', component: MensajeRecPasswordComponent},
  {path: 'reset/validatePassword', component: ValidateLinkComponent},
  {path: 'reset/invalidLink', component: InvalidLinkComponent},
  {path: 'reset/password', component: ResetPasswordComponent},
  {path: 'reset/passwordMessage', component: ResetPasswordMessageComponent},
  {
    path: '',
    component: MainLayoutComponent,
    data: {pageTitle: 'Home'},
    canActivate: [AuthGuard],
    children: [
      {
        path: '', redirectTo: 'dashboard/analytics', pathMatch: 'full'
      },
      {
        path: 'smartadmin',
        loadChildren: 'app/+smartadmin-intel/smartadmin-intel.module#SmartadminIntelModule',
        data: {pageTitle: 'Smartadmin'}
      },
      {
        path: 'app-views',
        loadChildren: 'app/+app-views/app-views.module#AppViewsModule',
        data: {pageTitle: 'App Views'}
      },
      {
        path: 'calendar',
        loadChildren: 'app/+calendar/calendar.module#CalendarModule'
      },
      {
        path: 'e-commerce',
        loadChildren: 'app/+e-commerce/e-commerce.module#ECommerceModule',
        data: {pageTitle: 'E-commerce'}
      },
      {
        path: 'forms',
        loadChildren: 'app/+forms/forms-showcase.module#FormsShowcaseModule',
        data: {pageTitle: 'Forms'}
      },
      {
        path: 'graphs',
        loadChildren: 'app/+graphs/graphs-showcase.module#GraphsShowcaseModule',
        data: {pageTitle: 'Graphs'}
      },
      {
        path: 'maps',
        loadChildren: 'app/+maps/maps.module#MapsModule',
        data: {pageTitle: 'Maps'}
      },
      {
        path: 'miscellaneous',
        loadChildren: 'app/+miscellaneous/miscellaneous.module#MiscellaneousModule',
        data: {pageTitle: 'Miscellaneous'}
      },
      {
        path: 'outlook',
        loadChildren: 'app/+outlook/outlook.module#OutlookModule',
        data: {pageTitle: 'Outlook'}
      },
      {
        path: 'tables',
        loadChildren: 'app/+tables/tables.module#TablesModule',
        data: {pageTitle: 'Tables'}
      },
      {
        path: 'ui',
        loadChildren: 'app/+ui-elements/ui-elements.module#UiElementsModule',
        data: {pageTitle: 'Ui'}
      },
      {
        path: 'widgets',
        loadChildren: 'app/+widgets/widgets-showcase.module#WidgetsShowcaseModule',
        data: {pageTitle: 'Widgets'}
      },
      {
        path: 'mantenimientos',
        loadChildren: 'app/+mantenimiento/mantenimiento.module#MantenimientoModule',
        data: {pageTitle: 'Mantenimientos'}
      },
      {
        path: 'dashboard',
        loadChildren: 'app/+dashboard/dashboard.module#DashboardModule',
        data: {pageTitle: 'Dashboard'}
      },
      {
        path: 'seguridad',
        loadChildren: 'app/+seguridad/seguridad.module#SeguridadModule',
        data: {pageTitle: 'Seguridad'}
      },
      {
        path: 'personal',
        loadChildren: 'app/+personal/personal.module#PersonalModule',
        data: {pageTitle: 'Personal'}
      },
      {
        path: 'autogestion',
        loadChildren: 'app/+autogestion/autogestion.module#AutogestionModule',
        data: {pageTitle: 'Autogestion'}
      },
      {
        path: 'gestionTiempo',
        loadChildren: 'app/+gestion-tiempo/gestion.tiempo.module#GestionTiempoModule',
        data: {pageTitle: 'Gestion de Tiempo'}
      },
      {
        path: 'organizacion',
        loadChildren: 'app/+organizacion/organizacion.module#OrganizacionModule',
        data: {pageTitle: 'Organizacion'}
      }
    ]
  },

  {path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule'},

  {path: '**', redirectTo: 'miscellaneous/error404'}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
