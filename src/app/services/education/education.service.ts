import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IEducation } from 'src/app/interfaces/IEducation';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  http = inject(HttpClient);
  endpoint = environment.endpoint + '/api';


  getEducationList(): Observable<IEducation[]> {
    return this.http.get<IEducation[]>(`${this.endpoint}/Education/GetEducationList`);
  }

  getSpecializationList(): Observable<IEducation[]> {
    return this.http.get<IEducation[]>(`${this.endpoint}/Specialization/GetSpecializationList`);
  }

  getSpecializationListByEducationId(educationId?: number): Observable<IEducation[]> {
    return this.http.get<IEducation[]>(`${this.endpoint}/Education/GetSpecializationListByEducationId?educationId=${educationId}`);
  }

  addNewCourse(payload: IEducation): Observable<IEducation> {
    return this.http.post<IEducation>(`${this.endpoint}/Education/SaveEducation`, payload);
  }

  updateCourse(payload: IEducation): Observable<IEducation> {
    return this.http.post<IEducation>(`${this.endpoint}/Education/UpdateEducation`, payload);
  }
}
