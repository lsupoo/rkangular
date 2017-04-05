import {RouterModule, Routes} from "@angular/router";


export const routes:Routes = [
  {
    path: 'login',
    loadChildren: ()=> System.import('./+login/login.module').then((m)=>m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: ()=> System.import('./+register/register.module').then((m)=>m.RegisterModule)
  },
  {
    path: 'forgot-password',
    loadChildren: ()=> System.import('./+forgot/forgot.module').then((m)=>m.ForgotModule)
  },
  {
    path: 'locked',
    loadChildren: ()=> System.import('./+locked/locked.module').then((m)=>m.LockedModule)
  },
  {
    path: 'noautorizado',
    loadChildren: ()=> System.import('./+noautorizado/noautorizado.module').then((m)=>m.NoAutorizadoModule)
  }
];

export const routing = RouterModule.forChild(routes);
