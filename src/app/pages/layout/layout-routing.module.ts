import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutPage } from './layout.page';

const isLoggedIn = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hasUserObj = user && typeof user === 'object' && Object.keys(user).length > 0;
  return hasUserObj && !!localStorage.getItem('token');
}

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    children: [
      {
        matcher: url => {
          if (isLoggedIn()) {
            return url.length ? { consumed: [] } : { consumed: url };
          }
          return null
        },
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        matcher: url => {
          if (!isLoggedIn()) {
            return url.length ? { consumed: [] } : { consumed: url };
          }
          return null
        },
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('../blog/blog.module').then(m => m.BlogPageModule)
      },
      {
        path: 'events',
        loadChildren: () => import('../events/events.module').then(m => m.EventsPageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('../contact/contact.module').then(m => m.ContactPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'profiles/view/:id',
        loadChildren: () => import('../profile-view/profile-view.module').then(m => m.ProfileViewPageModule)
      },
      {
        path: 'filter-profile',
        loadChildren: () => import('../profile-filter/profile-filter.module').then(m => m.ProfileFilterPageModule)
      },
      {
        path: 'payment-status',
        loadChildren: () => import('../payment/payment.module').then(m => m.PaymentPageModule)
      },
      {
        path: 'logout',
        loadChildren: () => import('../logout/logout.module').then(m => m.LogoutPageModule)
      },
      {
        path: 'more',
        loadChildren: () => import('../more/more.module').then(m => m.MorePageModule)
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('../privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
      },
      {
        path: 'refund-policy',
        loadChildren: () => import('../refund-policy/refund-policy.module').then(m => m.RefundPolicyPageModule)
      },
      {
        path: 'terms-condition',
        loadChildren: () => import('../terms-condition/terms-condition.module').then(m => m.TermsConditionPageModule)
      },
      {
        path: 'profile-history',
        loadChildren: () => import('../profile-history/profile-history.module').then(m => m.ProfileHistoryPageModule)
      },
      {
        path: '**',
        loadChildren: () => import('../not-found/not-found.module').then(m => m.NotFoundPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutPageRoutingModule { }
