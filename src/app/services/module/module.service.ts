import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {


  endpoint = environment.endpoint + '/api/Module';
  http = inject(HttpClient);

  getModuleList(): Observable<any> {
    return this.http.get(`${this.endpoint}/getModuleList`);
  }
}
