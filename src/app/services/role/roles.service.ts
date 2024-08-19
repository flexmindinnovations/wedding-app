import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  endpoint = environment.endpoint + '/api/Role';
  http = inject(HttpClient);

  getRoleList(): Observable<any> {
    return this.http.get(`${this.endpoint}/GetRoleList`);
  }

  getPermissionListById(roleId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/GetPermissionListByRoleId?roleId=${roleId}`)
  }

  saveRole(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/saveRoleMaster`, payload)
  }

  updateRole(payload: any): Observable<any> {
    return this.http.put(`${this.endpoint}/updateRoleMaster`, payload)
  }

}
