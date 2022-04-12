import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Menu } from '../interfaces/Menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  url = this.baseUrl + 'api/menu';
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getData<IMenu>(): Observable<IMenu> {
    var params = new HttpParams();
    var currentMenu = this.http.get<IMenu>(this.url, { params });
    return currentMenu;
  }

  deleteMenuItem(menuId: number): any {
    return this.http.delete(this.url + `/${menuId}`);
  }

  updateMenuItem(menuItem: Menu): any {
    return this.http.put(this.url + `/${menuItem.id}`, menuItem);
  }

  createMenuItem(menuItem: Menu): any {
    return this.http.post(this.url, menuItem);
  }
}
