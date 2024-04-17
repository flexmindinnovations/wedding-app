import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileFilterPage } from './profile-filter.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileFilterPageRoutingModule {}
