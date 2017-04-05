import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'blank'
  },

  {
    path: 'blank',
    loadChildren: ()=> System.import('./+blank/blank.module').then((m)=>m.BlankModule)
  },
  {
    path: 'ckeditor',
    loadChildren: ()=> System.import('./+ckeditor/ckeditor.module').then((m)=>m.CkeditorModule)
  },
  {
    path: 'email-template',
    loadChildren: ()=> System.import('./+email-template/email-template.module').then((m)=>m.EmailTemplateModule)
  },
  {
    path: 'error404',
    loadChildren: ()=> System.import('./+error404/error404.module').then((m)=>m.Error404Module)
  },
  {
    path: 'error500',
    loadChildren: ()=> System.import('./+error500/error500.module').then((m)=>m.Error500Module)
  },
  {
    path: 'invoice',
    loadChildren: ()=> System.import('./+invoice/invoice.module').then((m)=>m.InvoiceModule)
  },
  {
    path: 'pricing-tables',
    loadChildren: ()=> System.import('./+pricing-tables/pricing-tables.module').then((m)=>m.PricingTablesModule)
  },
  {
    path: 'search',
    loadChildren: ()=> System.import('./+search/search.module').then((m)=>m.SearchModule)
  },
];

export const routing = RouterModule.forChild(routes);




