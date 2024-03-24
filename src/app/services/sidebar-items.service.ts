import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, filter, map, tap, toArray } from 'rxjs';
import { SideBarItem } from '../interfaces/sidebar';

@Injectable({
  providedIn: 'root'
})
export class SidebarItemsService {

  http = inject(HttpClient);
  activeRoute = new Subject();
  currentPage = new Subject<{}>();

  getSidebarItems(): Observable<SideBarItem[]> {
    return this.http.get<SideBarItem[]>('../../assets/data/sidebar-items.json').pipe(
      map((menuItemList) => menuItemList.filter((item: any) => item.id !== 6)),
    );
  }

  setCurrentRoute(route: string): void {
    this.activeRoute.next(route);
  }

  getCurrentRoute(): Observable<any> {
    return this.activeRoute.asObservable();
  }

  setCurrentPage(pageName: {}) {
    this.currentPage.next(pageName);
  }

  getCurrentPage(): Observable<{}> {
    return this.currentPage.asObservable();
  }

}
