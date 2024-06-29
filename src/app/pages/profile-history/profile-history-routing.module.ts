import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileHistoryPage } from './profile-history.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileHistoryPageRoutingModule {}
