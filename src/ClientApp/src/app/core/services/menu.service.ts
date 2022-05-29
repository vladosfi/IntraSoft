import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Menu } from '../interfaces/Menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  endPoint = this.baseUrl + 'api/menus';
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getData<Menu>(): Observable<Menu> {
    var params = new HttpParams();
    var currentMenu = this.http.get<Menu>(this.endPoint, { params });
    return currentMenu;
  }

  deleteMenuItem(menuId: number): any {
    return this.http.delete(this.endPoint + `/${menuId}`);
  }

  updateMenuItem(menuItem: Menu): any {
    return this.http.put(this.endPoint + `/${menuItem.id}`, menuItem);
  }

  createMenuItem(menuItem: Menu): any {    
    return this.http.post(this.endPoint, menuItem);
  }
}
