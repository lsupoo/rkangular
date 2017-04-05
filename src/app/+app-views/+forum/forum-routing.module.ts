import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'general-view',
    loadChildren: ()=> System.import('./+general-view/general-view.module').then((m)=>m.GeneralViewModule)
  },

  {
    path: 'post-view',
    loadChildren: ()=> System.import('./+post-view/post-view.module').then((m)=>m.PostViewModule)
  },

  {
    path: 'topic-view',
    loadChildren: ()=> System.import('./+topic-view/topic-view.module').then((m)=>m.TopicViewModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ForumRoutingModule { }
