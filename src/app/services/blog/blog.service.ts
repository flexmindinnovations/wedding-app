import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  endpoint = environment.endpoint + '/api/Blog';
  http = inject(HttpClient);

  isRequestCompleted = new Subject();

  getBlogList(): Observable<any> {
    return this.http.get(`${this.endpoint}/getBlogList`);
  }

  getBlogById(blogId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/getBlogById?blogId=${blogId}`)
  }

  saveBlog(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/UploadImageWithBlogData`, payload)
  }

  updateBlog(payload: any): Observable<any> {
    return this.http.put(`${this.endpoint}/UpdateImageWithBlogData`, payload)
  }

  setRequestStatus(status: boolean, action: string) {
    this.isRequestCompleted.next({ status, action });
  }

  getRequestStatus(): Observable<any> {
    return this.isRequestCompleted.asObservable();
  }


}
