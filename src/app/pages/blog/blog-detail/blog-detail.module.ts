import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlogDetailPageRoutingModule } from './blog-detail-routing.module';

import { BlogDetailPage } from './blog-detail.page';
import { QuillModule } from 'ngx-quill';
import { BlogContentComponent } from './blog-content/blog-content.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuillModule.forRoot(),
    BlogDetailPageRoutingModule
  ],
  declarations: [BlogDetailPage, BlogContentComponent]
})
export class BlogDetailPageModule {}
