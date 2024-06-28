import { Injectable, inject, isDevMode, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBranch } from '../interfaces/IBranch';
import { HttpConfigService } from './http-config.service';
import { HttpClient } from '@angular/common/http';
import { MERCHANT_KEY_TEST, SALT_KEY_TEST, generateTxnId } from '../util/util';
import * as CryptoJS from 'crypto-js';

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
  userDetails = signal<any>({});
  envPath: PathVariable = isDevMode() ? 'local' : 'prod';

  nextButtonClick: any = new Subject();
  isFormValid = new Subject<boolean>();

  showAlert = new Subject();

  controlRest = new Subject();

  isLoggedInCompleted = new Subject();
  isLoggedOutCompleted = new Subject();

  isUnAuthorizedRequest = new Subject();

  isUserDetailUpdated = new Subject();

  isReadOnlyMode = new Subject();

  isNavigate = new Subject();

  blogData = new Subject();
  eventData = new Subject();
  imagesSelected = new Subject();
  footerItemClickEvent = new Subject();

  setFavouriteProfiles = new Subject();

  getLoggedInCustomerInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user ?? user;
  }

  getFavouriteProfiles(): Observable<any> {
    return this.setFavouriteProfiles.asObservable();
  }

  getImagesSelected(): Observable<any> {
    return this.imagesSelected.asObservable();
  }
  getEventData(): Observable<any> {
    return this.eventData.asObservable();
  }

  setRequestStatus(status: boolean) {
    this.isNavigate.next({ status });
  }

  getRequestStatus(): Observable<any> {
    return this.isNavigate.asObservable();
  }

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

  getPaymentObj(appEnv: string, payload: any): Observable<any> {
    const origin = window.location.href;
    const prodUrl = `https://susangam.faiznikah.com/api/v1/payment/${this.envPath}`;
    const endpoint = `http://localhost:3000/api/v1/payment/${this.envPath}`;

    return this.http.post(prodUrl, payload);
  }

  generateHash(value: string) {
    const hash = CryptoJS.SHA512(value);
    return hash.toString(CryptoJS.enc.Hex);
  }

  verifyPayment(payload: any): Observable<any> {
    const prodUrl = `https://susangam.faiznikah.com/api/v1/verify_payment/${this.envPath}`;
    const endpoint = this.envPath === 'local' ? `http://localhost:3000/api/v1/verify_payment/${this.envPath}` : `https://susangam.com/api/v1/verify_payment/${this.envPath}`;

    return this.http.post(prodUrl, payload);
  }

  saveCustomerPayment(payload: any): Observable<any> {
    const url = `${this.endpoint}/CustomerPayment/saveCustomerPayment`;
    return this.http.post(url, payload);
  }


  makePayment(): Observable<any> {
    var apiKey = MERCHANT_KEY_TEST;
    var salt = SALT_KEY_TEST;
    var txnId = generateTxnId();
    var amount = "100.00";
    var productInfo = "Test Product";
    var firstName = "John";
    var email = "john@example.com";
    var phone = "9999999999";
    var surl = "http://localhost:4200/payment";
    var furl = "http://localhost:4200/payment";
    var hashString = apiKey + "|" + txnId + "|" + amount + "|" + productInfo + "|" + firstName + "|" + email + "|||||||||||" + salt;
    var hash = this.sha512(hashString);

    // return new Promise((resolve, reject) => {
    //   var xhr = new XMLHttpRequest();
    //   xhr.open("POST", "https://test.payu.in/_payment", true);
    //   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //       console.log(xhr.responseText);
    //       resolve(xhr.responseText);
    //     }
    //   };

    var formData = new FormData();
    formData.append("key", apiKey);
    formData.append("txnid", txnId);
    formData.append("amount", amount);
    formData.append("productinfo", productInfo);
    formData.append("firstname", firstName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("surl", surl);
    formData.append("furl", furl);
    formData.append("hash", hash);

    //   xhr.send(formData);
    // })

    return this.http.post('/api/https://test.payu.in', formData);
  }

  sha512(value: any) {
    var hash = CryptoJS.SHA512(value);
    return hash.toString(CryptoJS.enc.Hex);
  }

}

type PathVariable = 'local' | 'prod';