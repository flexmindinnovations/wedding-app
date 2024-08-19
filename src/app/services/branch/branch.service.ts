import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { IBranch } from 'src/app/interfaces/IBranch';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  endpoint = environment.endpoint + '/api/Branch';
  http = inject(HttpClient);

  isRequest = new Subject<any>();

  addBranch(payload: any): Observable<any> {
    return this.http.postImage(`${this.endpoint}/UploadImageWithBranchData`, payload)
  }

  getBranchList(): Observable<IBranch[]> {
    return this.http.get(`${this.endpoint}/GetBranchList`);
  }


  getBranchByBranchId(branchId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/GetBranchById?branchId=${branchId}`);
  }

  updateBranch(payload: any): Observable<any> {
    return this.http.put(`${this.endpoint}/UpdateBranchDataWithUploadImage`, payload);
  }

  deleteBranchById(branchId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/Delete/${branchId}`);
  }

  setUpdate(isCompleted: boolean): void {
    this.isRequest.next(isCompleted);
  }

  getUpdate(): Observable<any> {
    return this.isRequest.asObservable();
  }
}
