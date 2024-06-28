import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {


  endpoint = environment.endpoint + '/api/Module';
  http = inject(HttpConfigService);

  getModuleList(): Observable<any> {
    return this.http.get(`${this.endpoint}/getModuleList`);
  }
}
