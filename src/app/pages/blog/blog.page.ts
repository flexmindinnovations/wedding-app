import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { BlogService } from 'src/app/services/blog/blog.service';
import { convert } from 'html-to-text';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DOMAIN } from 'src/app/util/theme';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit, AfterViewInit, OnDestroy {
  blogService = inject(BlogService);
  router = inject(NavController);
  deviceDetector = inject(DeviceDetectorService);
  sharedService = inject(SharedService);
  blogList: any[] = [];

  domain = DOMAIN;

  subs: Subscription[] = [];

  endpoint = environment.endpoint;

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.handlePopState();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getBlogList();
  }

  handlePopState() {
    this.getBlogList();
  }

  getBlogList() {
    this.subs.push(
      this.blogService.getBlogList().subscribe({
        next: (response: any) => {
          if (response) {
            this.blogList = response;
          }
        },
        error: (error: any) => {
          console.log('error: ', error);
        }
      })
    );
  }

  extractPlainTextFromRichText(richText: any): string {
    const isMobile = this.deviceDetector.isMobile();
    const htmlText = convert(richText).substring(0, 25).concat('...');
    return htmlText;
  }

  getImagePath(item: any) {
    const imagePath = this.endpoint + '/' + item?.blogImagePath;
    return imagePath;
  }

  handleBlogItemClick(blogInfo: any) {
    this.router.navigateForward(`blog/details/${blogInfo?.blogId}`);
    setTimeout(() => {
      this.sharedService.blogData.next(blogInfo);
    }, 200)
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.blogList = [];
  }

}
