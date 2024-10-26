import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

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
    loadChildren: () => import('../app/pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then(m => m.EventsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactPageModule)
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadChildren: () => import('../app/pages/layout/layout.module').then(m => m.LayoutPageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/logout/logout.module').then(m => m.LogoutPageModule)
  },
  {
    path: 'profile-filter',
    loadChildren: () => import('./pages/profile-filter/profile-filter.module').then(m => m.ProfileFilterPageModule)
  },
  {
    path: 'profile-view',
    loadChildren: () => import('./pages/profile-view/profile-view.module').then(m => m.ProfileViewPageModule)
  },
  {
    path: 'profile-history',
    loadChildren: () => import('./pages/profile-history/profile-history.module').then(m => m.ProfileHistoryPageModule)
  },

  // {
  //   path: '**',
  //   loadChildren: () => import('../app/pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
