import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBranch } from '../interfaces/IBranch';
import { HttpConfigService } from './http-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  endpoint = environment.endpoint + '/api';
  permissionListMap = new Map<string, any>();
  userPermissions = new Subject();
  http = inject(HttpConfigService);
  httpAssests = inject(HttpClient);
  customerData = new Map<string, any>();

  nextButtonClick: any = new Subject();
  isFormValid = new Subject<boolean>();

  showAlert = new Subject();

  controlRest = new Subject();

  isLoggedInCompleted = new Subject();
  isLoggedOutCompleted = new Subject();

  isReadOnlyMode = new Subject();

  blogData = new Subject();

  getBlogData(): Observable<any> {
    return this.blogData.asObservable();
  }

  handleNextButtonClick() {
    return this.nextButtonClick.asObservable();
  }

  getIsReadOnlyMode(): Observable<any> {
    return this.isReadOnlyMode.asObservable();
  }


  getIsLoggedInEvent() {
    return this.isLoggedInCompleted.asObservable();
  }
  getIsLoggedOutEvent() {
    return this.isLoggedOutCompleted.asObservable();
  }

  getIsFormValid() {
    return this.isFormValid.asObservable();
  }

  showAlertEvent() {
    return this.showAlert.asObservable();
  }

  resetControl() {
    return this.controlRest.asObservable();
  }

  setUserPermissions(permissionList: any) {
    this.userPermissions.next(permissionList);
  }

  getUserPermissions(): Observable<any> {
    return this.userPermissions.asObservable();
  }

  getDashboardItems(): Observable<any> {
    return this.httpAssests.get('../../assets/data/dashboard-items.json')
  }

  getCountryList(): Observable<IBranch[]> {
    return this.http.get(`${this.endpoint}/Country/GetCountries`);
  }
  getStatByCountry(countryId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/State/getStateListCountryIdWise?countyId=${countryId}`)
  }

  getCityByState(stateId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/City/getCityListStateIdWise?stateId=${stateId}`)
  }

  getHandyCapItemList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Handycap/GetHandycapList`);
  }

  getBloodGroupList(): Observable<any> {
    return this.http.get(`${this.endpoint}/BloodGroup/GetBloodGroupList`);
  }

  getFoodPreferencesList(): Observable<any> {
    return this.http.get(`${this.endpoint}/FoodPreferences/getFoodPreferencesList`);
  }

  getMotherToungeList(): Observable<any> {
    return this.http.get(`${this.endpoint}/MotherTongue/getMotherTongueList`);
  }

  getOccupationList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Occupation/getOccupationList`);
  }
  getOccupationById(occupationId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/Occupation/getOccupationById?occupationId=${occupationId}`);
  }
  getReligionList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Religion/getReligionList`);
  }
  getMotherTongueList(): Observable<any> {
    return this.http.get(`${this.endpoint}/MotherTongue/getMotherTongueList`);
  }


}
