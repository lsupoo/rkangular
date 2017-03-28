
import {RouterModule, Routes} from "@angular/router";


export const routes:Routes = [
  {
    path: 'forum',
    loadChildren: ()=>System.import('./+forum/forum.module').then((m)=>m.ForumModule)
  },
  {
    path: 'profile',
    loadChildren: ()=> System.import('./+profile/profile.module').then((m)=>m.ProfileModule)
  },
  {
    path: 'blog',
    loadChildren: ()=> System.import('./+blog/blog.module').then((m)=>m.BlogModule)
  },
  {
    path: 'gallery',
    loadChildren: ()=> System.import('./+gallery/gallery-demo.module').then((m)=>m.GalleryDemoModule)
  },
  {
    path: 'timeline',
    loadChildren: ()=> System.import('./+timeline/timeline.module').then((m)=>m.TimelineModule)
  },
  {
    path: 'projects',
    loadChildren: ()=> System.import('./+projects/projects-list.module').then((m)=>m.ProjectsListModule)
  },

];

export const routing = RouterModule.forChild(routes);
