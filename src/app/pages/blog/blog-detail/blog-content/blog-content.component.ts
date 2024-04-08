import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BlogService } from 'src/app/services/blog/blog.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-content',
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.scss'],
})
export class BlogContentComponent implements OnInit {

  blogInfo: any;
  blogId: any;
  createdDate: any;

  blogImagePath: string = '';
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.blogId = params['id'];
      this.getBlogDetails();
    });
  }

  getBlogDetails() {
    this.blogInfo = {};
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (response: any) => {
        if (response) {
          this.blogInfo = response;
          this.blogImagePath = `${environment.endpoint}/${this.blogInfo?.blogImagePath}`;
          this.createdDate = moment(this.blogInfo?.createdDate).format('MM-DD-YYYY');
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
      }
    })
  }

}
