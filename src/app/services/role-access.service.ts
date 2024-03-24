import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpConfigService } from './http-config.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService {

  endpoint = environment.endpoint + '/api';
  loadJson = inject(HttpClient);
  http = inject(HttpConfigService);


  getRoleAccessData(): Observable<any> {
    return this.loadJson.get('../../assets/data/access-roles.json');
  }

  getModuleList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Module/getModuleList`);
  }

  getRoleList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Role/GetRoleList`);
  }

  addNewRole(): Observable<any> {
    return this.http.get(`${this.endpoint}/Role/saveRoleMaster`);
  }

  updateRole(): Observable<any> {
    return this.http.get(`${this.endpoint}/Role/updateRoleMaster`);
  }


}
