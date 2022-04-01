import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getData<IMenu>(): Observable<IMenu> {
    var url = this.baseUrl + 'api/menu';
    var params = new HttpParams();
    var currentMenu = this.http.get<IMenu>(url, { params });
    return currentMenu;
  }


  //get<Menu>(id): Observable<Menu> {
  //  var url = this.baseUrl + "api/menu/" + id;
  //  return this.http.get<Menu>(url);
  //}


  
}
