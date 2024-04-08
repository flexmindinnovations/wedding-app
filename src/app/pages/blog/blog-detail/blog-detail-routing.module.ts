import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogDetailPage } from './blog-detail.page';
import { BlogContentComponent } from './blog-content/blog-content.component';

const routes: Routes = [
  {
    path: '',
    component: BlogDetailPage,
    children: [
      {
        path: ':id',
        component: BlogContentComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogDetailPageRoutingModule { }
