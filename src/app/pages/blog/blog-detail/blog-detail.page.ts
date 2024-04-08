import { style, transition, trigger, useAnimation } from '@angular/animations';
import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription, map, filter } from 'rxjs';
import { slideLeft, slideRight } from 'src/app/animations/carousel.animation';
import { BlogService } from 'src/app/services/blog/blog.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.page.html',
  styleUrls: ['./blog-detail.page.scss'],
  animations: [
    trigger('slideLeftRight', [
      transition('* => *', [useAnimation(slideLeft, { params: { time: '900ms' } })]),
      transition('* => *', [useAnimation(slideRight, { params: { time: '900ms' } })])
    ])
  ]
})
export class BlogDetailPage implements OnInit, AfterViewInit, OnDestroy {

  route = inject(ActivatedRoute);
  blogService = inject(BlogService);
  sharedService = inject(SharedService);
  router = inject(Router);
  blogId: any;
  blogInfo: any;
  blogList: any[] = [];
  filteredBlogList: any[] = [];

  subs: Subscription[] = [];
  endpoint = environment.endpoint;

  constructor(
    private zone: NgZone
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.getBlogList();
  }

  getBlogList() {
    this.blogList = [];
    this.subs.push(
      this.blogService.getBlogList().subscribe({
        next: (response: any) => {
          if (response) {
            this.blogList = response;
            this.filteredBlogList = JSON.parse(JSON.stringify(this.blogList));
            const blogList = this.blogList?.filter((item: any) => item.blogId != this.blogId);
            this.filteredBlogList = blogList;
          }
        },
        error: (error: any) => {
          console.log('error: ', error);
        }
      })
    );
  }


  handleBlogItemClick(blogInfo: any) {
    this.blogId = blogInfo?.blogId;
    this.router.navigate([`blog/details/${this.blogId}`]);
    this.filteredBlogList = [];
    setTimeout(() => {
      const blogList = this.blogList.filter((item: any) => item.blogId != this.blogId);
      this.filteredBlogList = blogList;
    }, 300)
  }

  getImagePath(item: any) {
    const imagePath = this.endpoint + '/' + item?.blogImagePath;
    return imagePath;
  }


  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.blogList = [];
    this.blogInfo = undefined;
  }

}
