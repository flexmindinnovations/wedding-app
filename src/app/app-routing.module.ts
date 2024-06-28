import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: '',
    loadChildren: () => import('../app/pages/layout/layout.module').then(m => m.LayoutPageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'profile-filter',
    loadChildren: () => import('./pages/profile-filter/profile-filter.module').then( m => m.ProfileFilterPageModule)
  },
  {
    path: 'profile-view',
    loadChildren: () => import('./pages/profile-view/profile-view.module').then( m => m.ProfileViewPageModule)
  },

  // {
  //   path: '**',
  //   loadChildren: () => import('../app/pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
